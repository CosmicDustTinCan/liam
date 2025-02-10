import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const cookieButton = page.getByRole('button', {
    name: 'Accept All Cookies',
  })
  await cookieButton.click({ timeout: 3000, force: true }).catch(() => {})
})

test.describe('Desktop Toolbar', () => {
  test('should be visible', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    await expect(toolbar).toBeVisible()
  })

  test('zoom in button should increase zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
    await zoomInButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test('zoom out button should decrease zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
    await zoomOutButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
      Number.parseInt(zoomLevelAfter),
    )
  })
})

test.describe('Mobile Toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const openToolbarButton = page.getByRole('button', {
      name: 'Open toolbar',
    })
    await openToolbarButton.click()
  })

  test('should be visible', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    await expect(toolbar).toBeVisible()
  })

  test('zoom in button should increase zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('div[class*="zoomPercent"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
    await zoomInButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test('zoom out button should decrease zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('div[class*="zoomPercent"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
    await zoomOutButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
      Number.parseInt(zoomLevelAfter),
    )
  })
})
