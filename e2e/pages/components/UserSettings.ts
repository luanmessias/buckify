import type { Locator, Page } from "@playwright/test"
import { t } from "@/e2e/utils/i18n-helper"
import { BasePage } from "../BasePage"

export class UserSettingsComponent extends BasePage {
	readonly container: Locator
	readonly familyNameInput: Locator
	readonly familyBudgetInput: Locator
	readonly saveButton: Locator
	readonly deleteAccountButton: Locator
	readonly deleteTriggerButton: Locator
	readonly deleteConfirmationInput: Locator
	readonly cancelDeleteButton: Locator
	readonly dangerZoneTitle: Locator

	constructor(page: Page, parent: Locator) {
		super(page)
		this.container = parent

		this.familyNameInput = this.container.getByPlaceholder(
			t("UserSettings.family_name_placeholder"),
		)
		this.familyBudgetInput = this.container.getByLabel(
			t("UserSettings.monthly_budget"),
		)

		this.saveButton = this.container.getByRole("button", {
			name: t("UserSettings.save_changes"),
		})

		this.deleteTriggerButton = this.container.getByRole("button", {
			name: t("UserSettings.delete_account_button"),
		})

		this.dangerZoneTitle = this.container.getByText(
			t("UserSettings.danger_zone_title"),
		)

		this.deleteConfirmationInput = this.container.getByLabel(
			t("UserSettings.delete_confirmation_label"),
		)

		this.deleteAccountButton = this.container.getByRole("button", {
			name: t("UserSettings.delete_button"),
		})

		this.cancelDeleteButton = this.container.getByRole("button", {
			name: t("UserSettings.cancel_delete"),
		})
	}

	async updateFamilyName(name: string) {
		await this.familyNameInput.fill(name)
	}

	async updateFamilyBudget(budget: string) {
		await this.familyBudgetInput.fill(budget)
	}

	async saveChanges() {
		await this.saveButton.click()
	}

	async deleteAccount() {
		await this.deleteTriggerButton.click()
	}

	async fillDeleteField(text: string) {
		await this.deleteConfirmationInput.fill(text)
	}

	async cancelDelete() {
		await this.cancelDeleteButton.click()
	}
}
