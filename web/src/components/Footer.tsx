import { profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl space-y-2 px-6 py-10 text-std-16N-170 text-fg-muted">
        <p>ここで発信している内容は個人の見解であり、所属組織の公式見解ではありません。</p>
        <p>© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
