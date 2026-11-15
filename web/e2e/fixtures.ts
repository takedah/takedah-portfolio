import { expect, test as base } from '@playwright/test'
import { contentSecurityPolicy } from '../../infra/lib/content-security-policy'

export const test = base.extend<{ problems: string[] }>({
  page: async ({ page }, provide) => {
    // 本番の CloudFront と同じ CSP を、すべての応答に付ける
    await page.route('**/*', async (route) => {
      const response = await route.fetch()
      await route.fulfill({
        response,
        headers: { ...response.headers(), 'content-security-policy': contentSecurityPolicy },
      })
    })
    await provide(page)
  },
  problems: [
    async ({ page }, provide) => {
      const problems: string[] = []
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console: ${message.text()}`)
      })
      page.on('requestfailed', (request) => {
        // 再読み込みで中断されたリクエストは、失敗として数えない
        if (request.failure()?.errorText !== 'net::ERR_ABORTED') problems.push(`requestfailed: ${request.url()}`)
      })
      page.on('response', (response) => {
        if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`)
      })
      await provide(problems)
      // 例外、コンソールのエラー（CSP の違反を含む）、読み込みの失敗が 1 件もないことを、テストの最後に確かめる
      expect(problems).toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
