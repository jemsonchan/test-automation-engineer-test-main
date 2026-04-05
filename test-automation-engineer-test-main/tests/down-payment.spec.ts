import { expect, test } from "@playwright/test";
import { LeaseRequestLeaseLandingPage } from "../pageObjects/LeaseRequestLeaseLandingPage";
import { LeaseWelkZwaarMaterieelPage } from "../pageObjects/LeaseWelkZwaarMaterieelPage";
import { LeaseProposalsPage } from "../pageObjects/LeaseProposalsPage";
import {
  LeaseCalculatorOptions,
  MachineConditions,
  MachineTypes,
  ExpectedLeadTimelines,
} from "../enums";

const downPaymentTestData = [
  { amount: 5500 },
  { amount: 11000 },
  { amount: 16500 },
];

test.describe("Down payment affects monthly payment", () => {
  test("Increasing the down payment results in a lower monthly payment", async ({
    page,
  }) => {
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
      constructionYear: new Date().getFullYear(),
      expectedLeadTimeline: ExpectedLeadTimelines.SEVENTY_TWO_HOURS,
      companyName: "Beequip B.V.",
      kvk: 63204258,
    });

    const leaseProposalsPage = new LeaseProposalsPage(page);
    await leaseProposalsPage.waitForProposalsToLoad();

    const results: { amount: number; monthlyPayment: number }[] = [];

    for (const testCase of downPaymentTestData) {
      await test.step(`Set down payment to €${testCase.amount}`, async () => {
        await leaseProposalsPage.setDownPaymentAmount(testCase.amount);
        const monthlyPayment =
          await leaseProposalsPage.getMonthlyPaymentAmount();
        results.push({ amount: testCase.amount, monthlyPayment });
      });
    }

    await test.step(
      "Verify higher down payment results in lower monthly payment",
      async () => {
        for (let i = 1; i < results.length; i++) {
          const previous = results[i - 1];
          const current = results[i];
          expect(
            current.monthlyPayment,
            `€${current.amount} down: €${current.monthlyPayment.toFixed(2)}/mo should be less than €${previous.amount} down: €${previous.monthlyPayment.toFixed(2)}/mo`,
          ).toBeLessThan(previous.monthlyPayment);
        }
      },
    );
  });
});
