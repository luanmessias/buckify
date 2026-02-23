import { expect, test } from "@playwright/test"
import { HeaderComponent } from "@/e2e/models/components/Header"
import { LoginPage } from "@/e2e/models/pages/LoginPage"

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
