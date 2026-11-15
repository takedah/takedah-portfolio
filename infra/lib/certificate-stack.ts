import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import type { HostedZoneConfig } from './config';

export interface CertificateStackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: HostedZoneConfig;
}

export class CertificateStack extends cdk.Stack {
  readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const zone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'Zone', props.hostedZone);

    // 検証用の CNAME レコードは既存のホストゾーンに自動で作られる
    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(zone),
    });
  }
}
