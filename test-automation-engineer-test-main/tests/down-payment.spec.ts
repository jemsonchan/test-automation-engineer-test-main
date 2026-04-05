// @ts-check
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

type DownPaymentTestData = {
  downPaymentPercentage: number;
  expectedMonthlyPayment: number;
};

const MAX_DELTA = 15;

/**
 * Data-driven test data for down payment percentages.
 *
 * Business rule: increasing the down payment results in a lower monthly payment.
 * Each entry specifies a down payment percentage and the expected monthly payment.
 * The actual monthly payment must be within €15 of the expected value.
 *
 * Note: Expected monthly payment values should be calibrated by running the test
 * once against the staging environment and recording the actual values displayed.
 * Update the `expectedMonthlyPayment` values below accordingly.
 */
const downPaymentTestData: DownPaymentTestData[] = [
  { downPaymentPercentage: 5, expectedMonthlyPayment: 0 },
  { downPaymentPercentage: 10, expectedMonthlyPayment: 0 },
  { downPaymentPercentage: 15, expectedMonthlyPayment: 0 },
];

test.describe("Down payment affects monthly payment", () => {
  test("Increasing the down payment results in a lower monthly payment", async ({
    page,
  }) => {
    // Navigate to the landing page and start the lease calculator
    const leaseRequestLandingPage = new LeaseRequestLeaseLandingPage(page);
    await leaseRequestLandingPage.visit();
    await leaseRequestLandingPage.clickCalculateYourMonthlyAmountButton();

    // Fill out the equipment details form
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
      downPaymentPercentage: 0,
      expectedMonthlyPayment: 0,
    });

    // Wait for the proposals page to load
    const leaseProposalsPage = new LeaseProposalsPage(page);
    await leaseProposalsPage.waitForProposalsToLoad();

    // Collect monthly payments for each down payment percentage
    const results: { percentage: number; monthlyPayment: number }[] = [];

    for (const testCase of downPaymentTestData) {
      await test.step(
        `Set down payment to ${testCase.downPaymentPercentage}%`,
        async () => {
          await leaseProposalsPage.setDownPaymentPercentage(
            testCase.downPaymentPercentage,
          );
          const monthlyPayment =
            await leaseProposalsPage.getMonthlyPaymentAmount();

          results.push({
            percentage: testCase.downPaymentPercentage,
            monthlyPayment,
          });

          // Assert the actual monthly payment is within €15 of the expected value
          // (only when expected values have been calibrated, i.e. > 0)
          if (testCase.expectedMonthlyPayment > 0) {
            const delta = Math.abs(
              monthlyPayment - testCase.expectedMonthlyPayment,
            );
            expect(
              delta,
              `Monthly payment €${monthlyPayment.toFixed(2)} should be within €${MAX_DELTA} ` +
                `of expected €${testCase.expectedMonthlyPayment.toFixed(2)} ` +
                `for ${testCase.downPaymentPercentage}% down payment (delta: €${delta.toFixed(2)})`,
            ).toBeLessThanOrEqual(MAX_DELTA);
          }
        },
      );
    }

    // Assert the core business rule: higher down payment → lower monthly payment
    await test.step(
      "Verify higher down payment results in lower monthly payment",
      async () => {
        for (let i = 1; i < results.length; i++) {
          const previous = results[i - 1];
          const current = results[i];

          expect(
            current.monthlyPayment,
            `Monthly payment with ${current.percentage}% down (€${current.monthlyPayment.toFixed(2)}) ` +
              `should be less than with ${previous.percentage}% down (€${previous.monthlyPayment.toFixed(2)})`,
          ).toBeLessThan(previous.monthlyPayment);
        }
      },
    );
  });
});