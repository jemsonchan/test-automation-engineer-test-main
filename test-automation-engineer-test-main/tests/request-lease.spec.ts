// @ts-check
import { expect, test } from "@playwright/test";

import { LeaseRequestLeaseLandingPage } from "../pageObjects/LeaseRequestLeaseLandingPage";
import { LeaseWelkZwaarMaterieelPage } from "../pageObjects/LeaseWelkZwaarMaterieelPage";

import {
  LeaseCalculatorOptions,
  MachineConditions,
  MachineTypes,
} from "../enums";
import { ExpectedLeadTimelines } from "../enums";

test("Calculate the monthly payment for a new object", async ({ page }) => {
  const leaseRequestLandingPage = new LeaseRequestLeaseLandingPage(page);

  await leaseRequestLandingPage.visit();
  await leaseRequestLandingPage.clickCalculateYourMonthlyAmountButton();

  const leaseWelkZwaarMaterieelPage = new LeaseWelkZwaarMaterieelPage(page);

  await leaseWelkZwaarMaterieelPage.fillOutEquipmentDetails({
    machineType: MachineTypes.VRACHTWAGEN_GVW_MORE_THAN_16_TON,
    machineCondition: MachineConditions.NEW,
    purchasePrice: 110000,
    leaseCalculatorOption: LeaseCalculatorOptions.CALCULATE_MONTHLY_AMOUNT,
    doYouKnowTheModel: false,
    constructionYear: 2021,
    expectedLeadTimeline: ExpectedLeadTimelines.SEVENTY_TWO_HOURS,
    companyName: "Beequip B.V.",
    kvk: 63204258,
  });

  await expect(
    page.getByRole("heading", { name: "Slimme voorstellen" }),
  ).toBeVisible({ timeout: 12_000 });
});
