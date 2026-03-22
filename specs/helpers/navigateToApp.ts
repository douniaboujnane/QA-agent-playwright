import { expect, type Page } from "@playwright/test"

export async function navigateToApp(
  page: Page,
  baseUrl: string,
  password: string
) {
  page.on("dialog", async (dialog) => {
    await dialog.accept(password)
  })
  await page.goto(baseUrl)
  await expect(page).toHaveURL(baseUrl)
}
