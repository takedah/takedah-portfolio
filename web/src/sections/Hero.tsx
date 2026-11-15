import { BookOpen, FolderGit2, Presentation } from 'lucide-react'
import avatarUrl from '../assets/avatar.jpg'
import { links, profile } from '../data/profile'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-network absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-24 md:flex-row-reverse md:items-center md:justify-between md:py-32">
        <img
          src={avatarUrl}
          alt=""
          width={160}
          height={160}
          className="size-32 shrink-0 rounded-full border-4 border-surface object-cover shadow-2 ring-1 ring-line md:size-40"
        />
        <div>
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
      </div>
    </section>
  )
}
