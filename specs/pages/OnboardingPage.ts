import { BasePage } from "./BasePage";

export class OnboardingPage extends BasePage {
  get backButton() {
    return this.page.getByRole("button", { name: "Back" });
  }

  get nextButton() {
    return this.page.getByRole("button", { name: "Next" });
  }

  get firstConsentCheckbox() {
    return this.page.getByRole("checkbox", { name: "I consent to my Health" });
  }

  get secondConsentCheckbox() {
    return this.page.getByRole("checkbox", {
      name: "I have read and agree to the",
    });
  }

  get startQuestionnaireButton() {
    return this.page.getByRole("button", { name: "Start Questionnaire" });
  }
}
