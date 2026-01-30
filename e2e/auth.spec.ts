import { expect, test } from "@playwright/test"
import { t } from "./utils/i18n-helper"

test.describe("Feature: Auth", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login")
	})

	test.describe("Happy Path (Main Flow)", () => {
		test("should login from the Dev Mode button and redirect to dashboard view", async ({
			page,
		}) => {
			const loginButton = page.getByText(t("Auth.dev_mode_button"))
			await loginButton.click()

			await expect(page).toHaveURL("/")

			const userAvatarButton = page.getByTestId("user-area-trigger-button")
			await expect(userAvatarButton).toBeVisible()
		})

		test("should keep the active session after reload the page", async ({
			page,
		}) => {
			const loginButton = page.getByText(t("Auth.dev_mode_button"))
			await loginButton.click()
			await page.waitForURL("/")

			await page.reload()
			await page.waitForURL("/")

			const userAvatarButton = page.getByTestId("user-area-trigger-button")
			await expect(userAvatarButton).toBeVisible()
		})

		test("it should logout from side menu button", async ({ page }) => {
			const loginButton = page.getByText(t("Auth.dev_mode_button"))
			await loginButton.click()

			await page.waitForURL("/")

			const avatarButton = page.getByTestId("user-area-trigger-button")
			await avatarButton.click()

			const logoutButton = page.getByTestId("user-area-logout-button")
			await logoutButton.click()

			await page.context().clearCookies()

			await page.goto("/login")

			await expect(page).toHaveURL(/\/login/)
		})
	})

	test.describe("Edge Cases & Security", () => {
		test("it should not be able to access the dashboard directly when is not logged", async ({
			page,
		}) => {
			await page.goto("/")
			await expect(page).toHaveURL(/\/login/)
		})

		test("it should redirect to dashboard if logged user try to access the /login directly", async ({
			page,
		}) => {
			const loginButton = page.getByText(t("Auth.dev_mode_button"))
			await loginButton.click()

			await page.waitForURL("/")

			await page.goto("/login")
			await expect(page).toHaveURL("/")
		})
	})
})
