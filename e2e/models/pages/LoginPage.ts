import type { Locator, Page } from "@playwright/test"
import { BasePage } from "@/e2e/models/pages/BasePage"
import { t } from "@/e2e/utils/i18n-helper"

export class LoginPage extends BasePage {
	readonly devModeButton: Locator

	constructor(page: Page) {
		super(page, "/login")

		this.devModeButton = page.getByText(t("Auth.dev_mode_button"))
	}

	async loginWithDevMode() {
		await this.devModeButton.click()
	}
}
