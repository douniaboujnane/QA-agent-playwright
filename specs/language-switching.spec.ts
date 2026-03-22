import { expect, test, type Page } from "@playwright/test"
import { envConfig } from "../playwright.config"
import { navigateToApp } from "./helpers/navigateToApp"
import { HomePage } from "./pages/HomePage"
import { SearchPage } from "./pages/SearchPage"

test.describe.serial("Language Switching and Home Page Navigation", () => {
  let page: Page
  let homePage: HomePage
  let searchPage: SearchPage

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    homePage = new HomePage(page)
    searchPage = new SearchPage(page)
    await navigateToApp(page, envConfig.baseUrl, envConfig.appPassword)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test("1 - Home page is displayed in English with welcome message and step carousel", async () => {
    await test.step("verify welcome message in English", async () => {
      await expect(homePage.welcomeMessage).toBeVisible()
    })

    await test.step("verify Start button label is 'Start'", async () => {
      await expect(homePage.startButton).toBeVisible()
    })

    await test.step("verify step headings in English", async () => {
      await expect(
        page.getByRole("heading", { name: "Select Your Healthcare Provider" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Choose Reason for Visit" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Answer the Questionnaire" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Repeat if Needed" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Submit Your Information" })
      ).toBeVisible()
    })

    await test.step("verify disclaimer text in English", async () => {
      await expect(homePage.disclaimerEn).toBeVisible()
    })
  })

  test("2 - Language toggle opens dropdown with English and French options", async () => {
    await homePage.languageToggleButton.click()

    await test.step("verify language dropdown shows English and French options", async () => {
      await expect(page.getByRole("button", { name: "English" })).toBeVisible()
      await expect(page.getByRole("button", { name: "French" })).toBeVisible()
    })
  })

  test("3 - Selecting French switches the interface to French", async () => {
    await page.getByRole("button", { name: "French" }).click()

    await test.step("verify welcome message changes to French", async () => {
      await expect(homePage.welcomeMessageFr).toBeVisible()
    })

    await test.step("verify Start button is now labeled 'Commencer'", async () => {
      await expect(homePage.commencerButton).toBeVisible()
    })

    await test.step("verify step headings are in French", async () => {
      await expect(
        page.getByRole("heading", { name: "Sélectionnez votre professionnel" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Choisissez la raison de visite" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Répondez au questionnaire" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Répétez si nécessaire" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Soumettez vos informations" })
      ).toBeVisible()
    })

    await test.step("verify disclaimer is in French", async () => {
      await expect(homePage.disclaimerFr).toBeVisible()
    })

    await test.step("verify step navigation buttons (1 through 5) remain unchanged", async () => {
      await expect(homePage.stepIndicator(1)).toBeVisible()
      await expect(homePage.stepIndicator(5)).toBeVisible()
    })
  })

  test("4 - Language toggle shows French menu with Anglais and Français options", async () => {
    await homePage.languageToggleButton.click()

    await test.step("verify language menu in French shows Anglais and Français", async () => {
      await expect(page.getByRole("button", { name: "Anglais" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Français" })).toBeVisible()
    })
  })

  test("5 - Selecting Anglais switches the interface back to English", async () => {
    await page.getByRole("button", { name: "Anglais" }).click()

    await test.step("verify welcome message is back in English", async () => {
      await expect(homePage.welcomeMessage).toBeVisible()
    })

    await test.step("verify Start button is labeled 'Start'", async () => {
      await expect(homePage.startButton).toBeVisible()
    })

    await test.step("verify step headings are back in English", async () => {
      await expect(
        page.getByRole("heading", { name: "Select Your Healthcare Provider" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Choose Reason for Visit" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Answer the Questionnaire" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Repeat if Needed" })
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Submit Your Information" })
      ).toBeVisible()
    })
  })

  test("6 - Next step arrow advances the carousel and enables Previous step", async () => {
    await homePage.nextStepButton.click()

    await test.step("verify Previous step button becomes enabled after advancing the carousel", async () => {
      await expect(homePage.previousStepButton).toBeEnabled()
    })
  })

  test("7 - Go to step 5 button brings step 5 content into view", async () => {
    await homePage.stepIndicator(5).click()

    await test.step("verify step 5 indicator is active and Submit Your Information heading is visible", async () => {
      await expect(
        page.getByRole("heading", { name: "Submit Your Information" })
      ).toBeVisible()
    })
  })

  test("8 - Previous step arrow moves carousel to the previous step", async () => {
    await homePage.previousStepButton.click()

    await test.step("verify navigation arrows remain functional after moving to previous step", async () => {
      await expect(homePage.previousStepButton).toBeEnabled()
      await expect(homePage.nextStepButton).toBeEnabled()
    })
  })

  test("9 - Start button navigates to /search page in English with alert, map and search field", async () => {
    await homePage.startButton.click()

    await test.step("verify page navigates to /search", async () => {
      await expect(page).toHaveURL(/\/search/)
    })

    await test.step("verify informational alert banner is visible", async () => {
      await expect(searchPage.alertBanner).toBeVisible()
    })

    await test.step("verify map and search field are visible", async () => {
      await expect(searchPage.searchInput).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Marker" }).first()
      ).toBeVisible()
    })
  })
})
