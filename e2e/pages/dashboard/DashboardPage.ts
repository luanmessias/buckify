import type { Locator, Page } from "@playwright/test"
import { HeaderComponent } from "@/e2e/pages/components/Header"

export class DashboardPage {
	readonly page: Page
	readonly userAvatarButton: Locator
	readonly logoutButton: Locator
	readonly header: HeaderComponent

	constructor(page: Page) {
		this.page = page
		this.userAvatarButton = page.getByTestId("user-area-trigger-button")
		this.logoutButton = page.getByTestId("user-area-logout-button")
		this.header = new HeaderComponent(page)
	}

	async goto() {
		await this.page.goto("/")
	}

	async logout() {
		await this.userAvatarButton.click()
		await this.logoutButton.click()
	}
}
