import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib/core';
import { CertificateStack } from '../lib/certificate-stack';
import { config } from '../lib/config';
import { SiteStack } from '../lib/site-stack';
import { context } from '../cdk.json';

// cdk synth と同じ機能フラグで合成する
const app = new cdk.App({ context });
const env = { account: '111111111111' };
const certificateStack = new CertificateStack(app, 'Certificate', {
  env: { ...env, region: 'us-east-1' },
  crossRegionReferences: true,
  domainName: config.domainName,
  hostedZone: config.hostedZone,
});
const siteStack = new SiteStack(app, 'Site', {
  env: { ...env, region: config.region },
  crossRegionReferences: true,
  domainName: config.domainName,
  hostedZone: config.hostedZone,
  certificate: certificateStack.certificate,
  githubRepository: config.githubRepository,
  githubEnvironment: config.githubEnvironment,
});
const site = Template.fromStack(siteStack);

const logicalId = (type: string) => Object.keys(site.findResources(type))[0];
const resourceProps = (type: string) => site.findResources(type)[logicalId(type)].Properties;

test('証明書はサイトのドメインだけを対象にし、ほかの名前（SAN）を含めない', () => {
  Template.fromStack(certificateStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: config.domainName,
    SubjectAlternativeNames: Match.absent(),
    ValidationMethod: 'DNS',
  });
});

test('バケットは公開しない', () => {
  site.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });
});

test('ディストリビューションは独自ドメインを使い、HTTP を HTTPS にリダイレクトする', () => {
  site.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: Match.objectLike({
      Aliases: [config.domainName],
      DefaultRootObject: 'index.html',
      DefaultCacheBehavior: Match.objectLike({ ViewerProtocolPolicy: 'redirect-to-https' }),
    }),
  });
});

test('デプロイ用ロールは production の Environment で動く GitHub Actions からだけ引き受けられる', () => {
  site.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: Match.objectLike({
      Statement: [
        Match.objectLike({
          Condition: {
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
              'token.actions.githubusercontent.com:sub': `repo:${config.githubRepository}:environment:${config.githubEnvironment}`,
            },
          },
        }),
      ],
    }),
  });
});

test('閲覧者への応答から Server ヘッダーを外す', () => {
  site.hasResourceProperties('AWS::CloudFront::ResponseHeadersPolicy', {
    ResponseHeadersPolicyConfig: Match.objectLike({
      RemoveHeadersConfig: { Items: [{ Header: 'Server' }] },
    }),
  });
});

test('A と AAAA のエイリアスレコードを作る', () => {
  site.resourceCountIs('AWS::Route53::RecordSet', 2);
});

test('CloudFront は OAC で S3 に接続する', () => {
  site.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
    OriginAccessControlConfig: {
      OriginAccessControlOriginType: 's3',
      SigningBehavior: 'always',
      SigningProtocol: 'sigv4',
    },
  });
  site.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        Match.objectLike({
          OriginAccessControlId: { 'Fn::GetAtt': [logicalId('AWS::CloudFront::OriginAccessControl'), 'Id'] },
          S3OriginConfig: { OriginAccessIdentity: '' },
        }),
      ],
    },
  });
});

test('バケットポリシーは HTTPS 以外のアクセスを拒否し、読み取りはこのディストリビューションにだけ許可する', () => {
  site.hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: [
        Match.objectLike({
          Effect: 'Deny',
          Action: 's3:*',
          Principal: { AWS: '*' },
          Condition: { Bool: { 'aws:SecureTransport': 'false' } },
        }),
        Match.objectLike({
          Effect: 'Allow',
          Action: 's3:GetObject',
          Principal: { Service: 'cloudfront.amazonaws.com' },
          Condition: {
            StringEquals: {
              'AWS:SourceArn': {
                'Fn::Join': ['', Match.arrayWith([{ Ref: logicalId('AWS::CloudFront::Distribution') }])],
              },
            },
          },
        }),
      ],
    },
  });
});

test('セキュリティヘッダーのポリシーを作り、デフォルトのキャッシュビヘイビアに適用する', () => {
  const headers = resourceProps('AWS::CloudFront::ResponseHeadersPolicy').ResponseHeadersPolicyConfig
    .SecurityHeadersConfig;
  const csp: string = headers.ContentSecurityPolicy.ContentSecurityPolicy;
  const directives = Object.fromEntries(
    csp.split(';').map((directive) => {
      const [name, ...sources] = directive.trim().split(/\s+/);
      return [name, sources];
    }),
  );
  expect(directives).toEqual({
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'form-action': ["'none'"],
    'upgrade-insecure-requests': [],
  });
  expect(headers.ContentSecurityPolicy.Override).toBe(true);
  expect(headers.ContentTypeOptions).toEqual({ Override: true });
  expect(headers.FrameOptions).toEqual({ FrameOption: 'DENY', Override: true });
  expect(headers.StrictTransportSecurity).toMatchObject({ AccessControlMaxAgeSec: 31536000, Override: true });

  site.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ResponseHeadersPolicyId: { Ref: logicalId('AWS::CloudFront::ResponseHeadersPolicy') },
      },
    },
  });
});

test('ビューアーとの接続には、TLSv1.2_2021 以上のセキュリティポリシーを使う', () => {
  site.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: Match.objectLike({ MinimumProtocolVersion: 'TLSv1.2_2021', SslSupportMethod: 'sni-only' }),
    },
  });
});

test('デプロイ用ロールには、S3 への配置と削除、一覧の取得、無効化の作成の権限だけを付ける', () => {
  const bucketArn = { 'Fn::GetAtt': [logicalId('AWS::S3::Bucket'), 'Arn'] };
  site.resourceCountIs('AWS::IAM::Role', 1);
  site.resourceCountIs('AWS::IAM::Policy', 1);
  site.hasResourceProperties('AWS::IAM::Role', { ManagedPolicyArns: Match.absent() });
  site.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        { Action: ['s3:DeleteObject', 's3:PutObject'], Effect: 'Allow', Resource: { 'Fn::Join': ['', [bucketArn, '/*']] } },
        { Action: 's3:ListBucket', Effect: 'Allow', Resource: bucketArn },
        {
          Action: 'cloudfront:CreateInvalidation',
          Effect: 'Allow',
          Resource: { 'Fn::Join': ['', Match.arrayWith([{ Ref: logicalId('AWS::CloudFront::Distribution') }])] },
        },
      ],
    },
  });
});

test('no-cache のファイルを CloudFront がリクエストのたびにオリジンへ確かめるように、最小 TTL を 0 にしたキャッシュポリシーを使う', () => {
  site.hasResourceProperties('AWS::CloudFront::CachePolicy', {
    CachePolicyConfig: Match.objectLike({ MinTTL: 0 }),
  });
  site.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: { CachePolicyId: { Ref: logicalId('AWS::CloudFront::CachePolicy') } },
    },
  });
});
