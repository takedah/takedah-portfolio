import type { LucideIcon } from 'lucide-react'
import { Bot, Cloud, Coins, Network, ShieldCheck } from 'lucide-react'

export const profile = {
  name: 'takedah',
  role: 'Government Cloud / AWS Network Engineer',
  tagline: '地方自治体の情報システム部門で、ガバメントクラウド対応に取り組んでいます。',
  location: 'Hokkaido',
  about: [
    'とある地方自治体の情報システム部門の職員で、ネットワーク、セキュリティ、AWS を中心に担当しています。情報システム部門での経験は通算10年以上です。行政とデジタル技術の関わりに関心があります。',
    'ガバメントクラウド（AWS）への移行では自治体側で、閉域接続のネットワーク機器と DNS の設計、複数ベンダーの AWS アカウント間の接続の調整、クラウド利用料の管理を担当しました。現在は RI / Savings Plans によるコスト最適化や、新しく AWS を使うシステムの設計レビューを担当しています。',
    '自宅の検証ネットワークや個人の AWS アカウントで試したことを、Qiita の記事や勉強会での発表にまとめています。',
  ],
}

export type Expertise = {
  icon: LucideIcon
  title: string
  description: string
  featured?: boolean
}

export const expertise: Expertise[] = [
  {
    icon: Network,
    title: '閉域ネットワーク設計',
    description: 'ガバメントクラウドへの閉域接続について、ネットワーク機器と名前解決（DNS）を設計しています。',
    featured: true,
  },
  {
    icon: Cloud,
    title: 'マルチアカウント接続',
    description: '複数ベンダーの AWS アカウント間の接続（Transit Gateway、ルーティング、名前解決、S3 のクロスアカウントアクセス）を調整しています。',
  },
  {
    icon: Coins,
    title: 'コスト最適化',
    description: 'RI / Savings Plans によるコスト最適化と、CUR を使った利用料の分析をしています。',
  },
  {
    icon: Bot,
    title: '生成 AI の閉域利用',
    description: '源内や Amazon Bedrock を閉域環境で使うための検証をしています。',
  },
  {
    icon: ShieldCheck,
    title: '設計レビュー',
    description: '新しく AWS を使うシステムについて、ネットワークとセキュリティの観点から設計をレビューしています。',
  },
]

export type Certification = { name: string; acquired?: string; badge?: string }
export type CertificationGroup = { title: string; items: Certification[] }

export const certifications: CertificationGroup[] = [
  {
    title: '情報処理技術者試験など',
    items: [
      { name: '情報処理安全確保支援士試験合格' },
      { name: 'ネットワークスペシャリスト試験合格' },
    ],
  },
  {
    title: 'AWS 認定',
    items: [
      {
        name: 'AWS Certified Advanced Networking – Specialty',
        acquired: '2024-06-08',
        badge: '/badges/aws-certified-advanced-networking-specialty.png',
      },
      {
        name: 'AWS Certified Solutions Architect – Professional',
        acquired: '2025-04-19',
        badge: '/badges/aws-certified-solutions-architect-professional.png',
      },
      {
        name: 'AWS Certified Solutions Architect – Associate',
        acquired: '2023-09-09',
        badge: '/badges/aws-certified-solutions-architect-associate.png',
      },
    ],
  },
  {
    title: 'AWS Microcredentials',
    items: [
      {
        name: 'AWS Application Networking Demonstrated',
        acquired: '2026-04-24',
        badge: '/badges/aws-application-networking-demonstrated.png',
      },
      {
        name: 'AWS Incident Response Demonstrated',
        acquired: '2026-05-01',
        badge: '/badges/aws-incident-response-demonstrated.png',
      },
      {
        name: 'AWS Serverless Demonstrated',
        acquired: '2026-08-29',
        badge: '/badges/aws-serverless-demonstrated.png',
      },
    ],
  },
]

export type Project = {
  name: string
  description: string
  url: string
  language: string
  forkOf?: string
}

export const projects: Project[] = [
  {
    name: 'genai-web',
    description: '源内 Web（AI インターフェース）を閉域ネットワークで動作するようにしたもの。',
    url: 'https://github.com/takedah/genai-web',
    language: 'TypeScript',
    forkOf: 'digital-go-jp/genai-web',
  },
  {
    name: 'genai-ai-api',
    description: '源内の AI アプリを閉域の AWS 環境へデプロイできるようにしたもの。',
    url: 'https://github.com/takedah/genai-ai-api',
    language: 'Python',
    forkOf: 'digital-go-jp/genai-ai-api',
  },
]

export type Link = { label: string; url: string; description: string }

export const links = {
  github: 'https://github.com/takedah',
  qiita: 'https://qiita.com/takeda_h',
  speakerDeck: 'https://speakerdeck.com/takeda_h',
}

export const writing: Link[] = [
  {
    label: 'Qiita',
    url: links.qiita,
    description: '検証の手順や技術的な気づきを公開しています。',
  },
  {
    label: 'Speaker Deck',
    url: links.speakerDeck,
    description: '勉強会で発表した資料を公開しています。',
  },
]

export type Article = { title: string; url: string; summary: string }

export const articles: Article[] = [
  {
    title: '自治体職員がガバメントクラウドの AWS 環境を理解するのに助けになった知識 n 選（閉域マルチアカウントのネットワーク関連多め）',
    url: 'https://qiita.com/takeda_h/items/9f264464ea3cc3c55f11',
    summary: 'ガバメントクラウドの AWS 環境を理解するのに役立った知識を、ガバナンス、ネットワーク、コストの観点から自治体職員向けにまとめています。',
  },
  {
    title: '閉域オンプレミスと AWS のハイブリッド構成における Route 53 アウトバウンド・インバウンドエンドポイントの名前解決パターンを構築してみる',
    url: 'https://qiita.com/takeda_h/items/bd7269a539079daeaa5d',
    summary: 'オンプレミスと AWS 間の DNS の動きを、検証環境を構築しながら整理しています。',
  },
  {
    title: 'ガバメント AI「源内」（genai-web）を閉域の AWS 環境へデプロイしてみた',
    url: 'https://qiita.com/takeda_h/items/47fce84d66bae672d744',
    summary: 'デジタル庁が公開した「源内」を、閉域の AWS 環境で動かせるように構成を変えてデプロイした記録です。',
  },
]

export type Talk = { date: string; title: string; slidesUrl: string; event: string; eventUrl: string }

// 新しい順
export const talks: Talk[] = [
  {
    date: '2026-08-07',
    title: 'ガバメント AI 源内を地方自治体は活用できるのか 可能性と課題、期待について',
    slidesUrl: 'https://speakerdeck.com/takeda_h/gabamento-ai-yuan-nei-wodi-fang-zi-zhi-ti-hahuo-yong-dekirunoka-ke-neng-xing-toke-ti-qi-dai-nituite',
    event: 'Gov-JAWS#8 JAWS-UG AI/ML支部コラボ：源内ハンズオン勉強会',
    eventUrl: 'https://gov-jaws.connpass.com/event/401100/',
  },
  {
    date: '2026-05-25',
    title: '自治体のガバメントクラウド AWS 移行で経験した大変だったことと今後の展望について',
    slidesUrl: 'https://speakerdeck.com/takeda_h/zi-zhi-ti-nogabamentokuraudo-aws-yi-xing-de-jing-yan-sitada-bian-datutakototojin-hou-nozhan-wang-nituite',
    event: '第48回 JAWS-UG札幌支部 x 秋田支部 コラボ勉強会',
    eventUrl: 'https://jawsug-sapporo.connpass.com/event/390989/',
  },
  {
    date: '2026-03-17',
    title: 'ガバメントクラウドにおける AWS の長期継続割引について',
    slidesUrl: 'https://speakerdeck.com/takeda_h/gabamentokuraudoniokeruawsnochang-qi-ji-sok-ge-yin-nituite',
    event: 'Gov-JAWS#6',
    eventUrl: 'https://gov-jaws.connpass.com/event/385581/',
  },
  {
    date: '2025-08-20',
    title: '自治体職員がガバクラの AWS 閉域ネットワークを理解するのにやって良かった個人検証環境',
    slidesUrl: 'https://speakerdeck.com/takeda_h/zi-zhi-ti-zhi-yuan-gagabakurano-aws-bi-yu-netutowakuwoli-jie-surunoniyatuteliang-katutage-ren-jian-zheng-huan-jing',
    event: 'Gov-JAWS#3',
    eventUrl: 'https://gov-jaws.connpass.com/event/363635/',
  },
  {
    date: '2024-12-18',
    title: 'Route 53 による名前解決の集約',
    slidesUrl: 'https://speakerdeck.com/takeda_h/20241218-di-4hui-zi-zhi-ti-sisutemubiao-zhun-hua-gabamentokuraudomian-qiang-hui-fa-biao-zi-liao',
    event: '第4回 自治体システム標準化・ガバメントクラウド勉強会',
    eventUrl: 'https://gov-cloud.connpass.com/event/339148/',
  },
]
