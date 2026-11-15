import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="text-std-16B-170 text-primary">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-1 text-std-32B-150">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </motion.div>
    </section>
  )
}
