import type { Page } from "@playwright/test"

export abstract class BasePage {
	readonly page: Page
	readonly url: string

	constructor(page: Page, url: string) {
		this.page = page
		this.url = url
	}

	async goto() {
		await this.page.goto(this.url)
	}

	async wait() {
		await this.page.waitForLoadState("domcontentloaded")
	}
}
