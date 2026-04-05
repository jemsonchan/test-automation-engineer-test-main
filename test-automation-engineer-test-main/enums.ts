export enum MachineTypes {
  VRACHTWAGEN_GVW_MORE_THAN_16_TON = "Vrachtwagen (GVW > 16 ton)",
  VRACHTWAGEN_GVW_LESS_THAN_16_TON = "Vrachtwagen (GVW < 16 ton)",
  TRACTOR = "Tractor",
  BEDRIJFSWAGEN = "Bedrijfswagen",
  MINIGRAAFMACHINE = "Minigraafmachine",
  WIELLADER = "Wiellader",
  MOBIELE_GRAAFMACHINE = "Mobiele graafmachine",
  RUPSGRAAFMACHINE = "Rupsgraafmachine",
  VORKHEFTRUCK = "Vorkheftruck",
  WAGEN_MET_AUTOLAADKRAAN = "Wagen met autolaadkraan",
}

export enum OtherMachineTypes {}

export enum MachineConditions {
  NEW = "Nieuw",
  USED = "Gebruikt",
}

export enum ExpectedLeadTimelines {
  SEVENTY_TWO_HOURS = "Binnen 72 uur",
  TWO_WEEKS = "Binnen 2 weken",
  THREE_MONTHS = "Binnen 3 maanden",
  ONE_YEAR = "Binnen één jaar",
  NOT_SURE = "Ik weet het nog niet zeker",
}

export enum LeaseCalculatorOptions {
  CALCULATE_MONTHLY_AMOUNT = "Bereken je maandlasten",
  CALCULATE_MAXIMUM_PURCHASE_VALUE = "Bereken je maximale aanschafwaarde",
  REFINANCE = "Herfinancier je materieel",
}
