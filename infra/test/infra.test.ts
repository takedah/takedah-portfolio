import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib/core';
import { CertificateStack } from '../lib/certificate-stack';
import { config } from '../lib/config';
import { SiteStack } from '../lib/site-stack';

const app = new cdk.App();
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

test('証明書はサイトのドメインだけを対象にする', () => {
  Template.fromStack(certificateStack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: config.domainName,
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

test('A と AAAA のエイリアスレコードを作る', () => {
  site.resourceCountIs('AWS::Route53::RecordSet', 2);
});
