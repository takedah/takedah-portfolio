import { ExternalLink } from 'lucide-react'
import { Section } from '../components/Section'
import { articles, talks, writing } from '../data/profile'

export function Writing() {
  return (
    <Section id="writing" eyebrow="Writing & Talks" title="アウトプット">
      <ul className="grid gap-4 md:grid-cols-2">
        {writing.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              className="group flex items-start justify-between gap-4 rounded-16 border border-line bg-surface p-6 shadow-1 hover:border-primary"
            >
              <span>
                <span className="block text-std-20B-150 group-hover:text-primary">{item.label}</span>
                <span className="mt-2 block text-fg-muted">{item.description}</span>
              </span>
              <ExternalLink aria-hidden className="size-5 shrink-0 text-fg-muted" />
            </a>
          </li>
        ))}
      </ul>

      <h3 className="mt-12 text-std-20B-150">主な記事</h3>
      <ul className="mt-4 space-y-6">
        {articles.map((article) => (
          <li key={article.url}>
            <a href={article.url} className="prose-link text-std-17B-170">
              {article.title}
            </a>
            <p className="mt-1 text-fg-muted">{article.summary}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-12 text-std-20B-150">登壇</h3>
      <ol className="mt-4 space-y-8 border-l border-line pl-6">
        {talks.map((talk) => (
          <li key={talk.slidesUrl} className="relative">
            <span aria-hidden className="absolute top-2 -left-[31px] size-3 rounded-full bg-primary" />
            <time dateTime={talk.date} className="text-std-16B-170 text-fg-muted">
              {talk.date}
            </time>
            <p className="mt-1">
              <a href={talk.slidesUrl} className="prose-link text-std-17B-170">
                {talk.title}
              </a>
            </p>
            <p className="mt-1 text-fg-muted">
              <a href={talk.eventUrl} className="prose-link">
                {talk.event}
              </a>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
