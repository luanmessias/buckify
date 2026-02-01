import type { Locator, Page } from "@playwright/test"

export class UserArea {
	readonly page: Page
	readonly logoutButton: Locator
	readonly familyNameInput: Locator

	constructor(page: Page) {
		this.page = page
		this.logoutButton = page.getByTestId("user-area-logout-button")
		this.familyNameInput = page.getByLabel("Family Name")
	}

	async logout() {
		await this.logoutButton.click()
	}

	async updateFamilyName(name: string) {
		await this.familyNameInput.fill(name)
		await this.page.getByRole("button", { name: "Save Changes" }).click()
	}
}
