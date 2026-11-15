#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { CertificateStack } from '../lib/certificate-stack';
import { config } from '../lib/config';
import { SiteStack } from '../lib/site-stack';

const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT;

// CloudFront の証明書は us-east-1 に置く必要がある
const certificateStack = new CertificateStack(app, 'PortfolioCertificate', {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
  domainName: config.domainName,
  hostedZone: config.hostedZone,
});

new SiteStack(app, 'PortfolioSite', {
  env: { account, region: config.region },
  crossRegionReferences: true,
  domainName: config.domainName,
  hostedZone: config.hostedZone,
  certificate: certificateStack.certificate,
  githubRepository: config.githubRepository,
  githubEnvironment: config.githubEnvironment,
});
