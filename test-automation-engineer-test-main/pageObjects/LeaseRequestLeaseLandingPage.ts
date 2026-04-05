import { Page } from "@playwright/test";
import { LeaseCalculatorOptions } from "../enums.js";
import { BasePage } from "./BasePage.js";

export class LeaseRequestLeaseLandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.url = "/";
  }

  async visit() {
    await super.navigateTo(this.url);
  }

  async clickCalculateYourMonthlyAmountButton() {
    await this.page
      .getByRole("link", {
        name: LeaseCalculatorOptions.CALCULATE_MONTHLY_AMOUNT,
      })
      .click();
  }
}
