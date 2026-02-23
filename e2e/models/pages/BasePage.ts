import { expect, type Page } from "@playwright/test"

export abstract class BasePage {
	readonly page: Page
	readonly url: string

	constructor(page: Page, url = "") {
		this.page = page
		this.url = url
	}

	async goto() {
		if (this.url) await this.page.goto(this.url)
	}

	async wait() {
		await this.page.waitForLoadState("domcontentloaded")
	}

	async reload() {
		await this.page.reload()
	}

	async validateToast(message: string) {
		await expect(this.page.getByText(message)).toBeVisible()
	}
}
