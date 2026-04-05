import test from "@playwright/test";
import { Page } from "@playwright/test";
export interface TestStepWaitOptions {
  waitForNetworkIdle?: boolean;
  waitForLoad?: boolean;
  waitForDOMContentLoaded?: boolean;
  waitForTimeoutBefore?: number;
  waitForNetworkIdleAfter?: boolean;
  waitForLoadAfter?: boolean;
  waitForDOMContentLoadedAfter?: boolean;
  waitForTimeoutAfter?: number;
}
export async function executeTestStep<T>(
  name: string,
  fn: () => Promise<T>,
  options?: TestStepWaitOptions,
  page?: Page,
): Promise<T> {
  const startTime = Date.now();

  try {
    if (page) {
      const shouldWaitForNetworkIdle = options?.waitForNetworkIdle !== false;

      if (options?.waitForTimeoutBefore) {
        await page.waitForTimeout(options.waitForTimeoutBefore);
      }
      if (shouldWaitForNetworkIdle) {
        await page.waitForLoadState("networkidle");
      }
      if (options?.waitForLoad) {
        await page.waitForLoadState("load");
      }
      if (options?.waitForDOMContentLoaded) {
        await page.waitForLoadState("domcontentloaded");
      }
    }

    const result = await test.step(name, fn);

    if (page && options) {
      if (options.waitForNetworkIdleAfter) {
        await page.waitForLoadState("networkidle");
      }
      if (options.waitForLoadAfter) {
        await page.waitForLoadState("load");
      }
      if (options.waitForDOMContentLoadedAfter) {
        await page.waitForLoadState("domcontentloaded");
      }
      if (options.waitForTimeoutAfter) {
        await page.waitForTimeout(options.waitForTimeoutAfter);
      }
    }

    return result;
  } finally {
    // Do nothing
  }
}
