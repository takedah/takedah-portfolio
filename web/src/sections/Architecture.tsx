import { ExternalLink } from 'lucide-react'
import architectureUrl from '../assets/architecture.svg'
import { Section } from '../components/Section'
import { architecture, designPoints, flows } from '../data/architecture'

export function Architecture() {
  return (
    <Section id="architecture" eyebrow="Architecture" title="このサイトの構成">
      <p className="max-w-3xl">{architecture.intro}</p>

      <div
        tabIndex={0}
        role="region"
        aria-label="構成図（横にスクロールできます）"
        className="mt-8 overflow-x-auto rounded-16 border border-line bg-white p-4"
      >
        <img
          src={architectureUrl}
          alt="このサイトの構成図。内容は図の下のリストで説明しています。"
          width={1052}
          height={600}
          className="h-auto w-full min-w-[720px]"
        />
      </div>

      <h3 className="mt-12 text-std-20B-150">構成図の説明</h3>
      <div className="mt-4 grid gap-8 md:grid-cols-3">
        {flows.map((flow) => (
          <div key={flow.title}>
            <h4 className="text-std-17B-170">{flow.title}</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-6 text-fg-muted">
              {flow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <h3 className="mt-12 text-std-20B-150">設計のポイント</h3>
      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {designPoints.map(({ icon: Icon, title, description }) => (
          <li key={title} className="rounded-16 border border-line bg-surface p-6 shadow-1">
            <Icon aria-hidden className="size-6 text-primary" />
            <h4 className="mt-4 text-std-20B-150">{title}</h4>
            <p className="mt-2 text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>

      <p className="mt-12">
        <a
          href={architecture.repositoryUrl}
          className="inline-flex items-center gap-2 rounded-8 border border-line px-6 py-3 text-std-16B-170 hover:bg-surface-raised"
        >
          GitHub でコードを見る
          <ExternalLink aria-hidden className="size-5" />
        </a>
      </p>
      <p className="mt-2 text-fg-muted">{architecture.repositoryNote}</p>
    </Section>
  )
}
