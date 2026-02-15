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
		await this.page.waitForTimeout(500)
		await this.familyNameInput.fill(name)
		await this.familyNameInput.blur()
	}

	async updateFamilyBudget(budget: string) {
		await this.page.waitForTimeout(500)
		await this.familyBudgetInput.fill(budget)
		await this.familyBudgetInput.blur()
	}

	async saveChanges() {
		const responsePromise = this.page.waitForResponse(
			(response) =>
				response.url().includes("/graphql") &&
				response.status() === 200 &&
				(response.request().postData()?.includes("UpdateHousehold") ?? false),
		)
		await this.saveButton.scrollIntoViewIfNeeded()
		await this.saveButton.click({ force: true })
		await responsePromise
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
