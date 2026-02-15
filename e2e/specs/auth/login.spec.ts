import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { HeaderComponent } from "@/e2e/pages/components/Header"
import { UserAreaComponent } from "@/e2e/pages/components/UserArea"
import { DashboardPage } from "@/e2e/pages/dashboard/DashboardPage"

test.describe("Feature: Auth", () => {
	let loginPage: LoginPage
	let dashboardPage: DashboardPage
	let userAreaComponent: UserAreaComponent
	let headerComponent: HeaderComponent

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page)
		dashboardPage = new DashboardPage(page)
		userAreaComponent = new UserAreaComponent(page)
		headerComponent = new HeaderComponent(page)

		await loginPage.goto()
	})

	test.describe("Happy Path (Main Flow)", () => {
		test("should login from the Dev Mode button and redirect to dashboard view", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await expect(page).toHaveURL("/", { timeout: 15000 })
			await expect(headerComponent.logo).toBeVisible()
		})

		test("should keep the active session after reload the page", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await expect(page).toHaveURL("/", { timeout: 15000 })
		})

		test("it should logout from side menu button", async ({ page }) => {
			await loginPage.loginWithDevMode()
			await expect(page).toHaveURL("/", { timeout: 15000 })

			await userAreaComponent.openUserArea()
			await userAreaComponent.logout()

			await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
		})
	})

	test.describe("Edge Cases & Security", () => {
		test("it should not be able to access the dashboard directly when is not logged", async ({
			page,
		}) => {
			await dashboardPage.goto()

			await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
		})

		test("it should redirect to dashboard if logged user try to access the /login directly", async ({
			page,
		}) => {
			await loginPage.loginWithDevMode()
			await expect(page).toHaveURL("/", { timeout: 15000 })

			await loginPage.goto()

			await expect(page).toHaveURL("/", { timeout: 15000 })
		})
	})
})
