import type { Locator, Page } from "@playwright/test"

export class UserAreaComponent {
	readonly page: Page
	readonly logoutButton: Locator
	readonly triggerButton: Locator
	readonly familyNameInput: Locator
	readonly closeButton: Locator
	readonly profilePhoto: Locator

	constructor(page: Page) {
		this.page = page
		this.logoutButton = page.getByTestId("user-area-logout-button")
		this.triggerButton = page.getByTestId("user-area-trigger-button")
		this.familyNameInput = page.getByLabel("Family Name")
		this.closeButton = page.getByTestId("user-area-close-button")
		this.profilePhoto = page.getByTestId("user-area-profile-photo")
	}

	async openUserArea() {
		await this.triggerButton.click()
	}

	async logout() {
		await this.logoutButton.click()
	}

	async updateFamilyName(name: string) {
		await this.familyNameInput.fill(name)
		await this.page.getByRole("button", { name: "Save Changes" }).click()
	}
}
