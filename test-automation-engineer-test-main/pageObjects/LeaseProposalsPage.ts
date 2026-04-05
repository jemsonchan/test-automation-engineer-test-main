import { Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { TestHelper } from "../utils/TestHelper";

export class LeaseProposalsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get proposalsHeading() {
    return this.page.getByRole("heading", { name: "Slimme voorstellen" });
  }

  get downPaymentInput() {
    return this.page.getByText("Aanbetaling").locator("..").locator("..").locator("input").first();
  }

  get monthlyPaymentContainer() {
    return this.page.getByText("Je betaalt per maand").locator("..");
  }

  async waitForProposalsToLoad(timeout: number = 15_000): Promise<void> {
    await this.proposalsHeading.waitFor({ state: "visible", timeout });
  }

  async setDownPaymentAmount(amount: number): Promise<void> {
    await this.downPaymentInput.clear();
    await this.downPaymentInput.fill(amount.toString());
    await this.downPaymentInput.press("Tab");
    await this.page.waitForTimeout(2000);
  }

    async getMonthlyPaymentAmount(): Promise<number> {
    const container = this.page.getByText("Je betaalt per maand").locator("..");
    const text = await container.textContent();
    if (!text) {
      throw new Error("Could not read monthly payment amount");
    }
    const match = text.match(/€\s*([\d.,]+)/);
    if (!match) {
      throw new Error("Could not find euro amount in: " + text);
    }
    return TestHelper.parseNumber("€ " + match[1]);
  }
}
