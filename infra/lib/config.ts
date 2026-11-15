export const config = {
  domainName: 'portfolio.dev.morori.jp',
  hostedZone: {
    hostedZoneId: 'Z09718741OQ9WAO0QYHCC',
    zoneName: 'dev.morori.jp',
  },
  // GitHub Actions からデプロイできるリポジトリと Environment。
  // リポジトリは、トークンの sub に入る「オーナー名@ID/リポジトリ名@ID」の形で書く。ID は名前を変えても変わらないので、同じ名前で作り直した別のリポジトリからはロールを引き受けられない。
  githubRepository: 'takedah@8471762/takedah-portfolio@1458517047',
  githubEnvironment: 'production',
  region: 'ap-northeast-1',
}

export type HostedZoneConfig = typeof config.hostedZone
