import type { Locator, Page } from "@playwright/test"
import { UserArea } from "./UserArea"

export class HeaderComponent {
	readonly page: Page
	private logo: Locator
	private userAvatarButton: Locator

	constructor(page: Page) {
		this.page = page
		this.logo = page.getByTestId("header-logo")
		this.userAvatarButton = page.getByTestId("user-avatar-button")
	}

	async clickLogo() {
		await this.logo.click()
	}

	async openUserArea(): Promise<UserArea> {
		await this.userAvatarButton.click()
		await this.page.getByTestId("user-sheet-content").waitFor()
		return new UserArea(this.page)
	}
}
