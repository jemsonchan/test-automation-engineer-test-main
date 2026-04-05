import { MachineConditions, MachineTypes, OtherMachineTypes } from "./enums";
import { ExpectedLeadTimelines, LeaseCalculatorOptions } from "./enums";

export interface IEquipmentDetailsTestData {
  machineCondition: MachineConditions;
  machineType: MachineTypes | OtherMachineTypes;
  purchasePrice: number;
  constructionYear: number;
}

export interface ILeaseRequestDetailsTestData extends IEquipmentDetailsTestData {
  expectedLeadTimeline: ExpectedLeadTimelines;
  companyName: string;
  kvk: number;
  doYouKnowTheModel: boolean;
  leaseCalculatorOption: LeaseCalculatorOptions;
  downPaymentPercentage: number;
  expectedMonthlyPayment: number;
}
