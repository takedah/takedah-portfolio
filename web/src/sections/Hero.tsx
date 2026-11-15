import { BookOpen, FolderGit2, Presentation } from 'lucide-react'
import { links, profile } from '../data/profile'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-network absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <p className="text-std-16B-170 text-primary">{profile.role}</p>
        <h1 className="mt-2 text-std-45B-140 md:text-dsp-64B-140">{profile.name}</h1>
        <p className="mt-6 max-w-2xl text-std-20N-150 text-fg-muted">{profile.tagline}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={links.github}
            className="inline-flex items-center gap-2 rounded-8 bg-primary px-6 py-3 text-std-16B-170 text-on-primary hover:bg-primary-hover"
          >
            <FolderGit2 aria-hidden className="size-5" />
            GitHub
          </a>
          <a
            href={links.qiita}
            className="inline-flex items-center gap-2 rounded-8 border border-line px-6 py-3 text-std-16B-170 hover:bg-surface-raised"
          >
            <BookOpen aria-hidden className="size-5" />
            Qiita
          </a>
          <a
            href={links.speakerDeck}
            className="inline-flex items-center gap-2 rounded-8 border border-line px-6 py-3 text-std-16B-170 hover:bg-surface-raised"
          >
            <Presentation aria-hidden className="size-5" />
            Speaker Deck
          </a>
        </div>
      </div>
    </section>
  )
}
