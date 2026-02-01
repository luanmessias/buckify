import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { DashboardPage } from "@/e2e/pages/dashboard/DashboardPage"

test.describe("Feature: Auth", () => {
	let loginPage: LoginPage
	let dashboardPage: DashboardPage

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page)
		dashboardPage = new DashboardPage(page)

		await loginPage.goto()
	})

	test.describe("Happy Path (Main Flow)", () => {
		test("should login from the Dev Mode button and redirect to dashboard view", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await expect(page).toHaveURL("/")
			await expect(dashboardPage.userAvatarButton).toBeVisible()
		})

		test("should keep the active session after reload the page", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await page.waitForURL("/")

			await page.reload()

			await expect(dashboardPage.userAvatarButton).toBeVisible()
		})

		test("it should logout from side menu button", async ({ page }) => {
			await loginPage.loginWithDevMode()
			await page.waitForURL("/")

			await dashboardPage.logout()

			await page.context().clearCookies()

			await expect(page).toHaveURL(/\/login/)
		})
	})

	test.describe("Edge Cases & Security", () => {
		test("it should not be able to access the dashboard directly when is not logged", async ({
			page,
		}) => {
			await dashboardPage.goto()

			await expect(page).toHaveURL(/\/login/)
		})

		test("it should redirect to dashboard if logged user try to access the /login directly", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await page.waitForURL("/")

			await loginPage.goto()

			await expect(page).toHaveURL("/")
		})
	})
})
