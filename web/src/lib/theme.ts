export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function storedTheme(): Theme | null {
  let value: string | null
  try {
    value = localStorage.getItem(STORAGE_KEY)
  } catch {
    // 保存を禁止する設定などで localStorage を使えないときは、保存したテーマがないものとして扱う
    return null
  }
  return value === 'light' || value === 'dark' ? value : null
}

export function currentTheme(): Theme {
  return storedTheme() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 保存できなくても、表示中のテーマは切り替える
  }
}
