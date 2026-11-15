import { ExternalLink, GitFork } from 'lucide-react'
import { Section } from '../components/Section'
import { projects } from '../data/profile'

export function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="公開リポジトリ">
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.name}>
            <a
              href={project.url}
              className="group flex h-full flex-col rounded-16 border border-line bg-surface p-6 shadow-1 hover:border-primary"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-std-20B-150 group-hover:text-primary">{project.name}</span>
                <ExternalLink aria-hidden className="size-5 text-fg-muted" />
              </span>
              <span className="mt-2 flex-1 text-fg-muted">{project.description}</span>
              <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-std-16N-170 text-fg-muted">
                <span>{project.language}</span>
                {project.forkOf && (
                  <span className="inline-flex items-center gap-1">
                    <GitFork aria-hidden className="size-4" />
                    Fork of {project.forkOf}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
