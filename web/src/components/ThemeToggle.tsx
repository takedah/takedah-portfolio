import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { applyTheme, currentTheme } from '../lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme)
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next)
        setTheme(next)
      }}
      aria-label={next === 'dark' ? 'ダークモードに切り替える' : 'ライトモードに切り替える'}
      className="inline-flex size-11 items-center justify-center rounded-8 border border-line text-fg hover:bg-surface-raised"
    >
      {theme === 'dark' ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
    </button>
  )
}
