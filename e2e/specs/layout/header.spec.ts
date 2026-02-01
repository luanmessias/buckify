import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { DashboardPage } from "@/e2e/pages/dashboard/DashboardPage"

test.describe("Layout: Header Component", () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page)
		await loginPage.goto()
		await loginPage.loginWithDevMode()
		await expect(page).toHaveURL("/")
	})

	test("it should navigate to home when clicking logo", async ({ page }) => {
		const dashboardPage = new DashboardPage(page)
		await dashboardPage.header.clickLogo()
		await expect(page).toHaveURL("/")
	})
})
