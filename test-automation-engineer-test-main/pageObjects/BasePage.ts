import { Page } from "@playwright/test";

export class BasePage {
  url!: string;
  urlPattern?: RegExp;

  constructor(protected readonly page: Page) {
    this.page = page;
  }

  async navigateTo(
    url?: string,
    options?: {
      waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
      timeout?: number;
    },
  ) {
    if (this.url) {
      await this.page.goto(this.url, { waitUntil: "load", ...options });
    } else if (url) {
      await this.page.goto(url, { waitUntil: "load", ...options });
    } else {
      throw new Error("No URL provided");
    }
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getPageUrl() {
    return this.page.url();
  }

  async getPageSource() {
    return await this.page.content();
  }

  async getPageText() {}
}

export default BasePage;
