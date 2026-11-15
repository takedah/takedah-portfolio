import { Section } from '../components/Section'
import { expertise } from '../data/profile'

export function Expertise() {
  return (
    <Section id="expertise" eyebrow="Expertise" title="専門分野">
      <ul className="grid gap-4 md:grid-cols-3">
        {expertise.map(({ icon: Icon, title, description, featured }) => (
          <li
            key={title}
            className={
              featured
                ? 'rounded-16 border border-line bg-primary-subtle p-8 md:col-span-2 md:row-span-2'
                : 'rounded-16 border border-line bg-surface p-6 shadow-1'
            }
          >
            <Icon aria-hidden className={featured ? 'size-10 text-primary' : 'size-6 text-primary'} />
            <h3 className={featured ? 'mt-6 text-std-28B-150' : 'mt-4 text-std-20B-150'}>{title}</h3>
            <p className="mt-2 text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
