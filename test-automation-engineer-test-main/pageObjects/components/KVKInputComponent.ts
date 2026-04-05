import { Page } from "@playwright/test";
import { TestHelper } from "../../utils/TestHelper.js";

export class KVKInputComponent {
  private readonly KVKnumberInputLocator_Selector: string = "#cocNumber";

  constructor(private readonly page: Page) {}

  async fill(kvkNumber: number, companyName: string): Promise<void> {
    await this.page
      .locator(this.KVKnumberInputLocator_Selector)
      .fill(kvkNumber.toString());
    await TestHelper.waitForVisibility(this.page.getByText(companyName));
    await this.page.getByText(companyName).click();
  }
}
