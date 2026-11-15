import { expect, test } from './fixtures'

const sectionTitles = ['自己紹介', '専門分野', '資格', '公開リポジトリ', 'アウトプット']

test('本番と同じ CSP の下で、主要なセクションが表示される', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'takedah' })).toBeVisible()
  for (const name of sectionTitles) {
    const heading = page.getByRole('heading', { level: 2, name })
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeVisible()
  }
})

test('バッジ画像と Noto Sans JP のフォントが読み込まれる', async ({ page }) => {
  await page.goto('/')
  const images = await page.locator('img').all()
  expect(images.length).toBeGreaterThan(0)
  for (const image of images) {
    await image.scrollIntoViewIfNeeded()
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true)
  }
  const fontLoaded = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].some((font) => font.family.includes('Noto Sans JP') && font.status === 'loaded')
  })
  expect(fontLoaded).toBe(true)
})

test.describe('テーマ', () => {
  test.use({ colorScheme: 'light' })

  test('テーマを切り替えると、再読み込みしても選んだテーマが続く', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'ダークモードに切り替える' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(26, 26, 26)')
    await expect(page.getByRole('button', { name: 'ライトモードに切り替える' })).toBeVisible()
  })

  test('localStorage を使えなくても表示され、テーマを切り替えられる', async ({ page }) => {
    // localStorage を使おうとすると、保存を禁止したブラウザと同じ例外が起きるようにする
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('The operation is insecure.', 'SecurityError')
        },
      })
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'takedah' })).toBeVisible()
    await page.getByRole('button', { name: 'ダークモードに切り替える' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('キーボードだけでテーマを切り替えられ、DADS のフォーカス表示が出る', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'ダークモードに切り替える' })
    for (let i = 0; i < 10 && !(await toggle.evaluate((element) => element === document.activeElement)); i++) {
      await page.keyboard.press('Tab')
    }
    await expect(toggle).toBeFocused()
    await expect(toggle).toHaveCSS('outline-style', 'solid')
    await expect(toggle).toHaveCSS('outline-width', '4px')
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})

test.describe('デスクトップ', () => {
  test.skip(({ isMobile }) => isMobile)

  test('ナビのリンクで、ページ内の各セクションへ移動する', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'ページ内' })
    for (const [label, id] of [
      ['About', 'about'],
      ['Expertise', 'expertise'],
      ['Certifications', 'certifications'],
      ['Projects', 'projects'],
      ['Writing', 'writing'],
    ]) {
      await nav.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
    }
  })
})

test.describe('動きを減らす設定', () => {
  test.use({ reducedMotion: 'reduce' })

  test('動きを減らす設定では、画面外のセクションも最初から表示されている', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#writing > div')).toHaveCSS('opacity', '1')
  })
})

test.describe('スマートフォン', () => {
  test.skip(({ isMobile }) => !isMobile)

  test('スマートフォンの幅で、横にはみ出さずに表示される', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'ページ内' })
    await expect(nav.getByRole('link', { name: 'About' })).toBeHidden()
    await expect(page.getByRole('button', { name: /モードに切り替える$/ })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
