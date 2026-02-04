import type { Locator, Page } from "@playwright/test"

export class HeaderComponent {
	readonly page: Page
	readonly logo: Locator
	readonly userAvatarButton: Locator

	constructor(page: Page) {
		this.page = page
		this.logo = page.getByTestId("header-logo")
		this.userAvatarButton = page.getByTestId("user-area-trigger-button")
	}

	async clickLogo() {
		await this.logo.click()
	}
}
