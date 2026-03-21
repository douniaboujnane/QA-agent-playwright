import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  get searchInput() {
    return this.page.getByRole("textbox", {
      name: "Search by name, location, or physician...",
    });
  }

  get alertBanner() {
    return this.page.getByRole("alert");
  }

  get clearSearchButton() {
    return this.page.getByRole("button", { name: "Clear search" });
  }

  get closePopupButton() {
    return this.page.getByRole("button", { name: "Close popup" });
  }
}
