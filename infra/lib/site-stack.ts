import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import type { HostedZoneConfig } from './config';

export interface SiteStackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: HostedZoneConfig;
  certificate: acm.ICertificate;
  githubRepository: string;
  githubEnvironment: string;
}

// ビルドした index.html にはインラインのスクリプトとスタイルがないので、CSP は 'self' だけで足りる
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

export class SiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    // バケットは公開せず、CloudFront から OAC でだけ読み取る
    const bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      securityHeadersBehavior: {
        contentSecurityPolicy: { contentSecurityPolicy, override: true },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(365),
          includeSubdomains: false,
          override: true,
        },
      },
      // オリジンの S3 が返す Server ヘッダーを、閲覧者への応答から外す
      removeHeaders: ['Server'],
    });

    // 最小 TTL を 0 にして、デプロイ時にオブジェクトに付ける Cache-Control に従う。no-cache のファイルは、CloudFront もリクエストのたびにオリジンへ更新を確かめる
    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      minTtl: cdk.Duration.seconds(0),
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy,
        responseHeadersPolicy,
      },
      defaultRootObject: 'index.html',
      domainNames: [props.domainName],
      certificate: props.certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });

    const zone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'Zone', props.hostedZone);
    const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
    new route53.ARecord(this, 'AliasRecord', { zone, recordName: props.domainName, target });
    new route53.AaaaRecord(this, 'AliasRecordIpv6', { zone, recordName: props.domainName, target });

    // GitHub Actions から長期のアクセスキーを使わずにデプロイする
    // 同じ URL の OIDC プロバイダーはアカウントに 1 つしか作れないので、CDK の外で作ったものを参照する
    const githubOidcProvider = iam.OidcProviderNative.fromOidcProviderArn(
      this,
      'GitHubOidcProvider',
      `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
    );

    const deployRole = new iam.Role(this, 'DeployRole', {
      description: `Deploy ${props.domainName} from GitHub Actions`,
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.oidcProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': `repo:${props.githubRepository}:environment:${props.githubEnvironment}`,
        },
      }),
    });

    // デプロイ用ロールには、aws s3 sync --delete と index.html の無効化に必要な権限だけを付ける
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:DeleteObject'],
        resources: [bucket.arnForObjects('*')],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({ actions: ['s3:ListBucket'], resources: [bucket.bucketArn] }),
    );
    distribution.grantCreateInvalidation(deployRole);

    // GitHub Actions のリポジトリ変数に設定する値
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn });
  }
}
