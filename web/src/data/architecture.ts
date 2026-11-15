import type { LucideIcon } from 'lucide-react'
import { Clock, FlaskConical, KeyRound, Lock, ShieldCheck } from 'lucide-react'

export const architecture = {
  intro:
    'このサイトは、S3 と CloudFront で配信する静的なサイトです。インフラは AWS CDK で管理し、サイトのファイルは GitHub Actions からデプロイしています。',
  repositoryUrl: 'https://github.com/takedah/takedah-portfolio',
  repositoryNote: 'インフラの定義は infra/、デプロイのワークフローは .github/workflows/ にあります。',
}

export type Flow = { title: string; steps: string[] }

export const flows: Flow[] = [
  {
    title: '閲覧の流れ',
    steps: [
      '閲覧者は Route 53 でドメイン名を解決し、HTTPS で CloudFront に接続します。',
      'CloudFront は us-east-1 の ACM 証明書で TLS 1.2 以上の接続を受け付け、レスポンスヘッダーポリシーで CSP や HSTS などのヘッダーを付けます。',
      'CloudFront は、キャッシュにないファイルや更新を確かめるファイルを、OAC で東京リージョンの非公開の S3 バケットから読み取ります。',
    ],
  },
  {
    title: 'デプロイの流れ',
    steps: [
      'main ブランチに push すると、GitHub Actions が production Environment で lint、ビルド、Playwright のテストを実行します。',
      'テストに通ると、GitHub Actions は OIDC でデプロイ用の IAM ロールを引き受け、S3 にファイルを配置して CloudFront のキャッシュを無効化します。',
    ],
  },
  {
    title: 'インフラの管理',
    steps: ['証明書とサイトの 2 つのスタックは、ローカルから AWS CDK でデプロイしています。'],
  },
]

export type DesignPoint = { icon: LucideIcon; title: string; description: string }

export const designPoints: DesignPoint[] = [
  {
    icon: Lock,
    title: '非公開の S3 と OAC',
    description:
      'バケットは公開せず、CloudFront から OAC で読み取ります。バケットポリシーでは読み取りをこのディストリビューションにだけ許可し、HTTPS 以外のアクセスを拒否しています。',
  },
  {
    icon: Clock,
    title: 'キャッシュの設計',
    description:
      'ハッシュ付きのファイルは 1 年キャッシュします。index.html は no-cache にし、CloudFront のキャッシュポリシーでも最小 TTL を 0 にしています。使わなくなったアセットも 30 日は残し、更新前に開いたページでも、そのページが参照する JS、CSS、フォントを読み込めるようにしています。',
  },
  {
    icon: ShieldCheck,
    title: 'セキュリティヘッダー',
    description:
      "CSP では読み込み元を 'self' だけに限り、unsafe-inline などの例外は使いません。HSTS、X-Frame-Options: DENY、nosniff も付けています。オリジンの S3 が返す Server ヘッダーは取り除いています。",
  },
  {
    icon: KeyRound,
    title: '長期のアクセスキーを使わないデプロイ',
    description:
      'GitHub Actions は OIDC で一時的な認証情報を受け取ります。ロールを引き受けられるのは、オーナーとリポジトリの ID を含む sub が一致し、main ブランチだけに限った production Environment で動くジョブだけです。権限は S3 への配置と削除、一覧の取得、CloudFront の無効化の作成だけです。',
  },
  {
    icon: FlaskConical,
    title: 'IaC とテスト',
    description:
      '証明書（us-east-1）とサイト（東京）の 2 つのスタックを CDK で管理しています。CDK のテストではデプロイ用ロールの権限、バケットポリシー、セキュリティヘッダーが意図したとおりで、余分な許可が入っていないことを確かめています。サイトは本番と同じ CSP の下で Playwright のテストをデスクトップとスマートフォンの画面サイズで通してから配置します。',
  },
]
