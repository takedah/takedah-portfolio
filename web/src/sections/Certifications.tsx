import { Award } from 'lucide-react'
import { Section } from '../components/Section'
import { certifications } from '../data/profile'

export function Certifications() {
  return (
    <Section id="certifications" eyebrow="Certifications" title="資格">
      <div className="space-y-10">
        {certifications.map((group) => (
          <div key={group.title}>
            <h3 className="text-std-20B-150">{group.title}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-center gap-4 rounded-12 border border-line px-5 py-4">
                  {item.badge ? (
                    <img src={item.badge} alt="" width={64} height={64} loading="lazy" className="size-16 shrink-0" />
                  ) : (
                    <Award aria-hidden className="size-6 shrink-0 text-primary" />
                  )}
                  <span>
                    <span className="block text-std-16B-170">{item.name}</span>
                    {item.acquired && (
                      <span className="block text-fg-muted">
                        取得日 <time dateTime={item.acquired}>{item.acquired}</time>
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
