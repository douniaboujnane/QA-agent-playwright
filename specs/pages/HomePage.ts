import { BasePage } from "./BasePage"

export class HomePage extends BasePage {
  get languageToggleButton() {
    return this.page.getByRole("button").first()
  }

  get startButton() {
    return this.page.getByRole("button", { name: "Start" })
  }

  get commencerButton() {
    return this.page.getByRole("button", { name: "Commencer" })
  }

  get nextStepButton() {
    return this.page.getByRole("button", { name: "Next step" })
  }

  get previousStepButton() {
    return this.page.getByRole("button", { name: "Previous step" })
  }

  get welcomeMessage() {
    return this.page.getByText(
      "Welcome to the Nurso platform. Prepare your appointment in 5 simple steps:"
    )
  }

  get welcomeMessageFr() {
    return this.page.getByText(
      "Bienvenue sur la plateforme Nurso. Préparez votre rendez-vous en 5 étapes simples:"
    )
  }

  get disclaimerEn() {
    return this.page.getByText(
      "Take care to select your usual healthcare professional with whom you already have a file. Otherwise, your appointment request will be automatically rejected."
    )
  }

  get disclaimerFr() {
    return this.page.getByText(
      "Prenez soin de sélectionner votre professionnel de la santé habituel et chez qui vous avez déjà un dossier. Autrement, votre demande de rendez-vous sera automatiquement rejetée."
    )
  }

  stepIndicator(step: number) {
    return this.page.getByRole("button", { name: `Go to step ${step}` })
  }
}
