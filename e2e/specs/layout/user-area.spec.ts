import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { UserAreaComponent } from "@/e2e/pages/components/UserArea"
import { t } from "@/e2e/utils/i18n-helper"
import { MOCK_DEV_USER } from "@/lib/constants/dev-mode"

test.describe("Component: UserArea", () => {
	let loginPage: LoginPage
	let userArea: UserAreaComponent

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page)
		userArea = new UserAreaComponent(page)

		await loginPage.goto()
		await loginPage.loginWithDevMode()
		await page.waitForURL("/")
	})

	test.describe("Opening Behavior", () => {
		test("opens via avatar click", async () => {
			await userArea.openUserArea()
			await expect(userArea.profilePhoto).toBeVisible()
		})
	})

	test.describe("Closing Behavior", () => {
		test.beforeEach(async () => {
			await userArea.openUserArea()
			await expect(userArea.profilePhoto).toBeVisible()
		})

		test("closes via 'X' button", async ({ page }) => {
			await page.getByRole("button", { name: "Close" }).click()
			await expect(userArea.userName).not.toBeVisible()
		})

		test("closes via backdrop click (click outside)", async ({ page }) => {
			await page.mouse.click(10, 10)
			await expect(userArea.userName).not.toBeVisible()
		})
	})

	test.describe("Data Verification", () => {
		test("displays correct user name from session", async () => {
			await userArea.openUserArea()
			await expect(userArea.userName).toHaveText(MOCK_DEV_USER.name)
		})

		test("displays the user e-mail", async () => {
			await userArea.openUserArea()
			await expect(userArea.userEmail).toHaveText(MOCK_DEV_USER.email)
		})
	})

	test("should toggle theme and icons correctly (roundtrip)", async ({
		page,
	}) => {
		await userArea.openUserArea()

		const sunIcon = userArea.themeToggleButton.locator("svg.lucide-sun")
		const moonIcon = userArea.themeToggleButton.locator("svg.lucide-moon")

		await expect(page.locator("html")).toHaveClass(/light/)
		await expect(sunIcon).toBeVisible()

		await userArea.themeToggle()
		await expect(page.locator("html")).toHaveClass(/dark/)
		await expect(moonIcon).toBeVisible()
		await expect(sunIcon).not.toBeVisible()

		await userArea.themeToggle()
		await expect(page.locator("html")).toHaveClass(/light/)
		await expect(sunIcon).toBeVisible()
	})

	test("update familly settings", async ({ page }) => {
		const newFamilyName = `Family ${Date.now()}`
		const newFamilyBudget = Math.floor(Math.random() * 500).toString()

		await test.step("Open User Area", async () => {
			await userArea.openUserArea()
			await expect(userArea.profilePhoto).toBeVisible()
		})

		await test.step("Fill Family Form", async () => {
			await userArea.settings.updateFamilyName(newFamilyName)
			await expect(userArea.settings.familyNameInput).toHaveValue(newFamilyName)

			await userArea.settings.updateFamilyBudget(newFamilyBudget)
			await expect(userArea.settings.familyBudgetInput).toHaveValue(
				newFamilyBudget,
			)
		})

		await test.step("Save Changes", async () => {
			await userArea.settings.saveChanges()
			await userArea.validateToast(t("UserSettings.success_toast"))
		})

		await test.step("Check saved data", async () => {
			await page.waitForTimeout(1000)
			await userArea.reload()
			await userArea.openUserArea()

			await expect(userArea.settings.familyNameInput).toHaveValue(newFamilyName)
			await expect(userArea.settings.familyBudgetInput).toHaveValue(
				newFamilyBudget,
			)
		})
	})

	test("Danger Zone", async () => {
		await test.step("open user area", async () => {
			await userArea.openUserArea()
			await expect(userArea.profilePhoto).toBeVisible()
		})

		await test.step("open the delete box", async () => {
			await userArea.settings.deleteAccount()
			await expect(userArea.settings.deleteAccountButton).toBeVisible()
		})

		await test.step("Type WRONG_WORD", async () => {
			const wrongWord = "WRONG_WORD"
			await userArea.settings.fillDeleteField(wrongWord)
			await expect(userArea.settings.deleteAccountButton).toBeDisabled()
		})

		await test.step("Type DELETE", async () => {
			const correntWord = "DELETE"
			await userArea.settings.fillDeleteField(correntWord)
			await expect(userArea.settings.deleteAccountButton).toBeEnabled()
		})

		await test.step("Cancel and close", async () => {
			await userArea.settings.cancelDelete()
			await expect(userArea.settings.deleteAccountButton).not.toBeVisible()
		})
	})
})
