export const config = {
  domainName: 'portfolio.dev.morori.jp',
  hostedZone: {
    hostedZoneId: 'Z09718741OQ9WAO0QYHCC',
    zoneName: 'dev.morori.jp',
  },
  // GitHub Actions からデプロイできるリポジトリと Environment
  githubRepository: 'takedah/takedah-portfolio',
  githubEnvironment: 'production',
  region: 'ap-northeast-1',
}

export type HostedZoneConfig = typeof config.hostedZone
