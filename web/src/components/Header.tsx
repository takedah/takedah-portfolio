import { profile } from '../data/profile'
import { ThemeToggle } from './ThemeToggle'

const nav = [
  { href: '#about', label: 'About' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#writing', label: 'Writing' },
  { href: '#projects', label: 'Projects' },
  { href: '#architecture', label: 'Architecture' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="text-std-18B-160">
          {profile.name}
        </a>
        <nav aria-label="ページ内" className="flex items-center gap-6">
          <ul className="hidden gap-6 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-std-16N-170 text-fg-muted hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
