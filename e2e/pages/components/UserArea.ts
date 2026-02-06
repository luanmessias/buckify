import type { Locator, Page } from "@playwright/test"
import { t } from "@/e2e/utils/i18n-helper"
import { MOCK_DEV_USER } from "@/lib/constants/dev-mode"

import { BasePage } from "../BasePage"
import { UserSettingsComponent } from "./UserSettings"

export class UserAreaComponent extends BasePage {
	readonly content: Locator
	readonly logoutButton: Locator
	readonly triggerButton: Locator
	readonly closeButton: Locator
	readonly profilePhoto: Locator
	readonly userName: Locator
	readonly userEmail: Locator
	readonly themeToggleButton: Locator

	readonly settings: UserSettingsComponent

	constructor(page: Page) {
		super(page)
		this.content = page.getByTestId("user-sheet-content")
		this.settings = new UserSettingsComponent(page, this.content)

		this.logoutButton = page.getByRole("button", {
			name: t("UserArea.logout_button"),
		})
		this.triggerButton = page.getByRole("button", {
			name: t("UserArea.trigger_aria_label"),
		})
		this.closeButton = page.getByRole("button", { name: "Close" })
		this.profilePhoto = page.getByTestId("user-area-avatar")
		this.userName = page.getByText(MOCK_DEV_USER.name)
		this.userEmail = page.getByText(MOCK_DEV_USER.email)
		this.themeToggleButton = page.getByRole("button", {
			name: t("UserArea.theme_toggle_button"),
		})
	}

	async openUserArea() {
		await this.triggerButton.click()
		await this.content.waitFor({ state: "visible" })
	}

	async closeUserArea() {
		await this.closeButton.click()
	}

	async logout() {
		await this.logoutButton.click()
	}

	async themeToggle() {
		await this.themeToggleButton.click()
	}
}
