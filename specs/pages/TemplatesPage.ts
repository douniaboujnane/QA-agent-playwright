import { BasePage } from "./BasePage";

export class TemplatesPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Select a reason for consultation" }).first();
  }

  get consultationReasonInput() {
    return this.page.getByRole("textbox", { name: "Enter your reason for consultation" });
  }

  get viewCompletedQuestionnairesLink() {
    return this.page.getByRole("link", { name: "View completed questionnaires" });
  }
}
