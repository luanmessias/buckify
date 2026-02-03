import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { HeaderComponent } from "@/e2e/pages/components/Header"

test.describe("Layout: Header Component", () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page)
		await loginPage.goto()
		await loginPage.loginWithDevMode()
		await expect(page).toHaveURL("/")
	})

	test("it should navigate to home when clicking logo", async ({ page }) => {
		const headerComponent = new HeaderComponent(page)
		await headerComponent.clickLogo()
		await expect(page).toHaveURL("/")
	})
})
