import { expect, test, type Page } from "@playwright/test"
import { envConfig } from "../playwright.config"
import testData from "./fixtures/test-data.json"
import { navigateToApp } from "./helpers/navigateToApp"
import { AppointmentSchedulingPage } from "./pages/AppointmentSchedulingPage"
import { OnboardingPage } from "./pages/OnboardingPage"
import { SearchPage } from "./pages/SearchPage"
import { TemplatesPage } from "./pages/TemplatesPage"

const { clinicKeyword, clinicName, clinicAddress, providerName } =
  testData.healthcareProviderSelection

test.describe.serial("Healthcare Provider Selection via Text Search", () => {
  let page: Page
  let searchPage: SearchPage
  let onboardingPage: OnboardingPage
  let appointmentSchedulingPage: AppointmentSchedulingPage
  let templatesPage: TemplatesPage

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    searchPage = new SearchPage(page)
    onboardingPage = new OnboardingPage(page)
    appointmentSchedulingPage = new AppointmentSchedulingPage(page)
    templatesPage = new TemplatesPage(page)
    await navigateToApp(page, envConfig.baseUrl, envConfig.appPassword)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test("1 - Home page is displayed with 5-step carousel", async () => {
    await test.step("verify welcome heading and Start button", async () => {
      await expect(
        page.getByText(
          "Welcome to the Nurso platform. Prepare your appointment in 5 simple steps:"
        )
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "Start" })).toBeVisible()
    })

    await test.step("verify step indicators 1 through 5", async () => {
      await expect(
        page.getByRole("button", { name: "Go to step 1" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Go to step 5" })
      ).toBeVisible()
    })
  })

  test("2 - Start button navigates to /search with map and alert", async () => {
    await test.step("click Start", async () => {
      await page.getByRole("button", { name: "Start" }).click()
    })

    await test.step("verify /search page with search input and alert banner", async () => {
      await expect(page).toHaveURL(/\/search/)
      await expect(searchPage.searchInput).toBeVisible()
      await expect(searchPage.alertBanner).toBeVisible()
    })
  })

  test(`3 - Searching ${clinicKeyword} shows ${clinicName} in results`, async () => {
    await test.step("type keyword in search field", async () => {
      await searchPage.searchInput.fill(clinicKeyword)
      await page.getByText(clinicName).first().waitFor({ state: "visible" })
    })

    await test.step("verify clinic results and clear button", async () => {
      await expect(page.getByText(clinicName)).toBeVisible()
      await expect(page.getByText(clinicAddress)).toBeVisible()
      await expect(searchPage.clearSearchButton).toBeVisible()
    })
  })

  test("4 - Clicking clinic card opens map popup with provider", async () => {
    await test.step("click clinic card", async () => {
      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${clinicName}${clinicAddress}$`) })
        .nth(1)
        .click()
    })

    await test.step("verify popup with clinic name, address and provider button", async () => {
      await expect(
        page.getByRole("heading", { name: clinicName })
      ).toBeVisible()
      await expect(page.getByText(clinicAddress)).toBeVisible()
      await expect(
        page.getByRole("button", { name: providerName })
      ).toBeVisible()
      await expect(searchPage.closePopupButton).toBeVisible()
    })
  })

  test("5 - Selecting provider navigates to /onboarding/1", async () => {
    await test.step("click provider button", async () => {
      await page.getByRole("button", { name: providerName }).click()
    })

    await test.step("verify onboarding/1 confirmation screen", async () => {
      await expect(page).toHaveURL(/\/onboarding\/1/)
      await expect(
        page.getByRole("heading", {
          name: "Welcome to Your Pre-appointment Questionnaire",
        })
      ).toBeVisible()
      await expect(page.getByText("You have selected")).toBeVisible()
      await expect(
        page.getByText(`${providerName} (${clinicName})`)
      ).toBeVisible()
      await expect(onboardingPage.backButton).toBeVisible()
      await expect(onboardingPage.nextButton).toBeVisible()
    })
  })

  test("6 - Next navigates to /onboarding/2 How It Works", async () => {
    await test.step("click Next", async () => {
      await onboardingPage.nextButton.click()
    })

    await test.step("verify How It Works screen", async () => {
      await expect(page).toHaveURL(/\/onboarding\/2/)
      await expect(
        page.getByRole("heading", { name: "How It Works" })
      ).toBeVisible()
      await expect(page.getByText("10-15 minutes")).toBeVisible()
      await expect(onboardingPage.backButton).toBeVisible()
      await expect(onboardingPage.nextButton).toBeVisible()
    })
  })

  test("7 - Next navigates to /onboarding/3 with disabled Start Questionnaire", async () => {
    await test.step("click Next", async () => {
      await onboardingPage.nextButton.click()
    })

    await test.step("verify Let's Get Started screen with unchecked checkboxes", async () => {
      await expect(page).toHaveURL(/\/onboarding\/3/)
      await expect(
        page.getByRole("heading", { name: "Let's Get Started" })
      ).toBeVisible()
      await expect(onboardingPage.firstConsentCheckbox).not.toBeChecked()
      await expect(onboardingPage.secondConsentCheckbox).not.toBeChecked()
      await expect(
        page.getByRole("link", {
          name: "Read the terms and conditions of use.",
        })
      ).toBeVisible()
      await expect(
        page.getByRole("link", { name: "Read the privacy policy." })
      ).toBeVisible()
      await expect(onboardingPage.startQuestionnaireButton).toBeDisabled()
    })
  })

  test("8 - Checking first checkbox keeps Start Questionnaire disabled", async () => {
    await test.step("check first consent checkbox", async () => {
      await onboardingPage.firstConsentCheckbox.click()
    })

    await test.step("verify first checkbox checked and button still disabled", async () => {
      await expect(onboardingPage.firstConsentCheckbox).toBeChecked()
      await expect(onboardingPage.startQuestionnaireButton).toBeDisabled()
    })
  })

  test("9 - Checking second checkbox enables Start Questionnaire", async () => {
    await test.step("check second consent checkbox", async () => {
      await onboardingPage.secondConsentCheckbox.click()
    })

    await test.step("verify second checkbox checked and button enabled", async () => {
      await expect(onboardingPage.secondConsentCheckbox).toBeChecked()
      await expect(onboardingPage.startQuestionnaireButton).toBeEnabled()
    })
  })

  test("10 - Start Questionnaire navigates to /appointment-scheduling", async () => {
    await test.step("click Start Questionnaire", async () => {
      await onboardingPage.startQuestionnaireButton.click()
    })

    await test.step("verify waiting room question", async () => {
      await expect(page).toHaveURL(/\/appointment-scheduling/)
      await expect(
        page.getByRole("heading", {
          name: "Are you currently in the waiting room?",
        })
      ).toBeVisible()
      await expect(
        page.getByText(
          "If you are already at the clinic and waiting to be seen, select Yes."
        )
      ).toBeVisible()
      await expect(appointmentSchedulingPage.yesWaitingRoomButton).toBeVisible()
      await expect(appointmentSchedulingPage.noWaitingRoomButton).toBeVisible()
      await expect(appointmentSchedulingPage.backButton).toBeVisible()
    })
  })

  test("11 - Not in waiting room shows appointment scheduled question", async () => {
    await test.step("click No, I am not in the waiting room", async () => {
      await appointmentSchedulingPage.noWaitingRoomButton.click()
    })

    await test.step("verify appointment scheduled question", async () => {
      await expect(
        page.getByRole("heading", {
          name: "Do you have an appointment scheduled for the questionnaire you are about to fill?",
        })
      ).toBeVisible()
      await expect(
        page.getByText(
          "This refers to the current appointment for which you are filling out this questionnaire — not a future one."
        )
      ).toBeVisible()
      await expect(
        appointmentSchedulingPage.yesAppointmentScheduledButton
      ).toBeVisible()
      await expect(
        appointmentSchedulingPage.noAppointmentYetButton
      ).toBeVisible()
      await expect(appointmentSchedulingPage.backButton).toBeVisible()
    })
  })

  test("12 - Has appointment shows date picker with Continue disabled", async () => {
    await test.step("click Yes, I have an appointment scheduled", async () => {
      await appointmentSchedulingPage.yesAppointmentScheduledButton.click()
    })

    await test.step("verify date picker with Today/Tomorrow shortcuts and disabled Continue", async () => {
      await expect(
        page.getByRole("heading", { name: "When is your appointment?" })
      ).toBeVisible()
      await expect(appointmentSchedulingPage.appointmentDateInput).toBeVisible()
      await expect(appointmentSchedulingPage.todayButton).toBeVisible()
      await expect(appointmentSchedulingPage.tomorrowButton).toBeVisible()
      await expect(appointmentSchedulingPage.continueButton).toBeDisabled()
    })
  })

  test("13 - Tomorrow shortcut populates date and enables Continue", async () => {
    await test.step("click Tomorrow shortcut", async () => {
      await appointmentSchedulingPage.tomorrowButton.click()
    })

    await test.step("verify date populated and Continue enabled", async () => {
      await expect(
        appointmentSchedulingPage.appointmentDateInput
      ).not.toHaveValue("")
      await expect(appointmentSchedulingPage.continueButton).toBeEnabled()
    })
  })

  test("14 - Continue navigates to /templates with consultation reason search", async () => {
    await test.step("click Continue", async () => {
      await appointmentSchedulingPage.continueButton.click()
    })

    await test.step("verify /templates page with search and instructional text", async () => {
      await expect(page).toHaveURL(/\/templates/)
      await expect(templatesPage.heading).toBeVisible()
      await expect(templatesPage.consultationReasonInput).toBeVisible()
      await expect(templatesPage.viewCompletedQuestionnairesLink).toBeVisible()
      await expect(
        page.getByText(
          "Please enter in the search field and then select from the choices below your reason for consultation."
        )
      ).toBeVisible()
    })
  })
})
