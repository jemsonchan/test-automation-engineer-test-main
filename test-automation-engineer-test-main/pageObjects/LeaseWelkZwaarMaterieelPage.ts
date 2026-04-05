import { MachineConditions, MachineTypes } from "../enums.js";
import { Page } from "@playwright/test";
import { ExpectedLeadTimelines } from "../enums.js";
import { KVKInputComponent } from "./components/KVKInputComponent.js";
import { BasePage } from "./BasePage.js";
import { ILeaseRequestDetailsTestData } from "../types";
import { executeTestStep } from "../utils/TestStepWrapper";

/**
 * Equipment Details page object
 */
export class LeaseWelkZwaarMaterieelPage extends BasePage {
  public kvkInputComponent: KVKInputComponent;

  constructor(page: Page) {
    super(page);
    this.kvkInputComponent = new KVKInputComponent(page);
  }

  get machineTypeDropDown() {
    return this.page.locator("[data-hook='top-category-select']");
  }

  get confirmMachineTypeButton() {
    return this.page.getByRole("button", { name: "Bevestigen" });
  }

  get selectConstructionYearDropdown() {
    return this.page.locator("[data-hook='object-year-select']");
  }

  get purchasePriceInput() {
    return this.page.locator("[data-hook='purchase-price-input']");
  }

  get expectedLeadTimelineDropdown() {
    return this.page.locator("[data-hook='expected-lead-timeline']");
  }

  get submitLeaseFormButton() {
    return this.page.locator("[data-hook='go-to-lease-price']");
  }

  async selectMachineType(machineType: MachineTypes) {
    await this.machineTypeDropDown.selectOption(machineType);
  }

  get doYouKnowTheModelRadioButton() {
    return this.page.getByRole("radio", { name: "brandAndType" });
  }

  async selectDoYouKnowTheModelRadioButton(answer: boolean) {
    if (answer) {
      await this.page.locator("[data-hook='radio-yes'] + label").click();
    } else {
      await this.page.locator("[data-hook='radio-no'] + label").click();
    }
  }

  async clickConfirmMachineTypeButton() {
    await this.confirmMachineTypeButton.click();
  }

  async selectConditionRadioButton(condition: MachineConditions) {
    await this.page.locator(`#${condition} + label`).click();
  }

  async selectConstructionYear(constructionYear: number) {
    if (constructionYear < new Date().getFullYear() - 12) {
      // TODO: Handle this case
    }
    await this.selectConstructionYearDropdown.selectOption(
      constructionYear.toString(),
    );
  }

  async fillPurchasePrice(purchasePrice: number) {
    await this.purchasePriceInput.fill(purchasePrice.toString());
  }

  async selectExpectedLeadTimeline(
    expectedLeadTimeline: ExpectedLeadTimelines,
  ) {
    await this.expectedLeadTimelineDropdown.selectOption(expectedLeadTimeline);
  }

  async clickSubmitLeaseFormButton() {
    await this.submitLeaseFormButton.click();
  }

  async fillOutEquipmentDetails(
    leaseRequestDetails: ILeaseRequestDetailsTestData,
  ) {
    await executeTestStep(
      "Beequip - Fill out lease request details",
      async () => {
        await this.selectDoYouKnowTheModelRadioButton(
          leaseRequestDetails.doYouKnowTheModel,
        );
        await this.selectMachineType(
          leaseRequestDetails.machineType as MachineTypes,
        );
        await this.clickConfirmMachineTypeButton();
        await this.selectConditionRadioButton(
          leaseRequestDetails.machineCondition,
        );

        await this.selectConstructionYear(leaseRequestDetails.constructionYear);
        await this.fillPurchasePrice(leaseRequestDetails.purchasePrice);
        await this.selectExpectedLeadTimeline(
          leaseRequestDetails.expectedLeadTimeline,
        );
        await this.kvkInputComponent.fill(
          leaseRequestDetails.kvk,
          leaseRequestDetails.companyName,
        );
        await this.clickSubmitLeaseFormButton();
      },
      { waitForNetworkIdle: false },
      this.page,
    );
  }
}
