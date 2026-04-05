import { expect, Locator, Page } from "@playwright/test";
/**
 * A helper class for tests.
 */
export class TestHelper {
  static async waitForVisibility(
    locator: Locator,
    timeout: number = 5000,
  ): Promise<boolean> {
    try {
      await expect(async () => {
        if (await locator.isVisible()) {
          return;
        }
      }).toPass({ intervals: [1000, 2000, 3000], timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Parses a string to a number.
   * @param str - The string to parse.
   * @returns The number.
   * @example
   * parseNumber("€ 1.313,79");
   * // => 1313.79
   */
  static parseNumber(str: string): number {
    // Remove currency symbols and trim
    let cleaned = str.replace(/[€$£¥]/g, "").trim();

    // Check if it has comma and dot to determine format
    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
      // Both comma and dot present - determine which is thousands, which is decimal
      const commaIndex = cleaned.indexOf(",");
      const dotIndex = cleaned.indexOf(".");

      if (commaIndex > dotIndex) {
        // Format: 1.313,79 (European: dot = thousands, comma = decimal)
        // Format: 10.000.00,79
        return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
      } else {
        // Format: 1,313.79 (US: comma = thousands, dot = decimal)
        return parseFloat(cleaned.replace(/,/g, ""));
      }
    } else if (hasComma && !hasDot) {
      // Only comma - check if it's decimal separator (1-2 digits after) or thousands
      const commaCount = (cleaned.match(/,/g) || []).length;
      if (commaCount === 1 && cleaned.split(",")[1].length <= 2) {
        // Single comma with 1-2 digits after = decimal separator (European)
        return parseFloat(cleaned.replace(",", "."));
      } else {
        // Multiple commas or many digits after = thousands separator
        return parseFloat(cleaned.replace(/,/g, ""));
      }
    } else if (hasDot && !hasComma) {
      // Only dot - check if single (decimal) or multiple (thousands)
      const dotCount = (cleaned.match(/\./g) || []).length;
      if (dotCount === 1) {
        // Single dot - could be decimal or thousands separator
        // Check if digits after dot are 3 digits (thousands separator pattern)
        const dotIndex = cleaned.indexOf(".");
        const afterDot = cleaned.substring(dotIndex + 1);
        // Extract only numeric digits after the dot
        const digitsAfterDot = afterDot.match(/^\d+/)?.[0] || "";
        // If exactly 3 digits after dot, likely thousands separator (e.g., 1.314 = 1314)
        // If 1-2 digits after dot, likely decimal separator (e.g., 1.31 = 1.31)
        if (digitsAfterDot.length === 3) {
          // Treat as thousands separator
          return parseFloat(cleaned.replace(/\./g, ""));
        } else {
          // Treat as decimal separator
          return parseFloat(cleaned);
        }
      } else {
        // Multiple dots = European thousands, last one is decimal
        return parseFloat(cleaned.replace(/\./g, ""));
      }
    } else {
      // No separators
      return parseFloat(cleaned);
    }
  }
}
