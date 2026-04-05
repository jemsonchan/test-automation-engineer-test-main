import { Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { TestHelper } from "../utils/TestHelper";

/**
 * Page object for the "Slimme voorstellen" (Smart proposals) results page.
 * This page appears after submitting the lease request form and displays
 * financing proposals including monthly payment and down payment options.
 */
export class LeaseProposalsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get proposalsHeading() {
    return this.page.getByRole("heading", { name: "Slimme voorstellen" });
  }

  get downPaymentInput() {
    return this.page.locator("[data-hook='down-payment-input']");
  }

  get downPaymentSlider() {
    return this.page.locator("[data-hook='down-payment-slider']");
  }

  get monthlyPaymentDisplay() {
    return this.page.locator("[data-hook='monthly-payment']");
  }

  async waitForProposalsToLoad(timeout: number = 15_000): Promise<void> {
    await this.proposalsHeading.waitFor({ state: "visible", timeout });
  }

  async setDownPaymentPercentage(percentage: number): Promise<void> {
    await this.downPaymentInput.fill(percentage.toString());
    // Wait for the monthly payment to recalculate after changing down payment
    await this.page.waitForTimeout(1000);
  }

  async getMonthlyPaymentAmount(): Promise<number> {
    const text = await this.monthlyPaymentDisplay.textContent();
    if (!text) {
      throw new Error("Could not read monthly payment amount");
    }
    return TestHelper.parseNumber(text);
  }
}