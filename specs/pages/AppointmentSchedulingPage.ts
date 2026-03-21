import { BasePage } from "./BasePage";

export class AppointmentSchedulingPage extends BasePage {
  get backButton() {
    return this.page.getByRole("button", { name: "Back" });
  }

  get yesWaitingRoomButton() {
    return this.page.getByRole("button", { name: "Yes, I am in the waiting room" });
  }

  get noWaitingRoomButton() {
    return this.page.getByRole("button", { name: "No, I am not in the waiting" });
  }

  get yesAppointmentScheduledButton() {
    return this.page.getByRole("button", { name: "Yes, I have an appointment" });
  }

  get noAppointmentYetButton() {
    return this.page.getByRole("button", { name: "No, I do not have an appointment yet" });
  }

  get appointmentDateInput() {
    return this.page.getByRole("textbox", { name: "Please select your" });
  }

  get todayButton() {
    return this.page.getByRole("button", { name: "Today" });
  }

  get tomorrowButton() {
    return this.page.getByRole("button", { name: "Tomorrow" });
  }

  get continueButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }
}
