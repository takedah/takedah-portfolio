import { MapPin } from 'lucide-react'
import { Section } from '../components/Section'
import { profile } from '../data/profile'

export function About() {
  return (
    <Section id="about" eyebrow="About" title="自己紹介">
      <div className="max-w-3xl space-y-4">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-6 inline-flex items-center gap-2 text-fg-muted">
        <MapPin aria-hidden className="size-5" />
        {profile.location}
      </p>
    </Section>
  )
}
