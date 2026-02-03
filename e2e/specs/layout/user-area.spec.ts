import { expect, test } from "@playwright/test"
import { LoginPage } from "@/e2e/pages/auth/LoginPage"
import { HeaderComponent } from "@/e2e/pages/components/Header"
import { UserAreaComponent } from "@/e2e/pages/components/UserArea"

test.describe("Layout: UserArea Component", () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page)
		const _header = new HeaderComponent(page)
		const userArea = new UserAreaComponent(page)

		await loginPage.goto()
		await loginPage.loginWithDevMode()
		await page.waitForURL("/")
		await userArea.openUserArea()
		await expect(userArea.profilePhoto).toBeVisible()
	})

	test.describe("it should be able to open the drawer sheet by:", () => {
		test("clicking on avatar button", () => {})
	})

	test.describe("it should be able to close the drawer sheet by:", () => {
		test("clicking on close button", async ({ page }) => {
			const userArea = new UserAreaComponent(page)
			await page.getByRole("button", { name: "Close" }).click()
			await expect(userArea.profilePhoto).toBeVisible()
		})

		test("clicking out area", async ({ page }) => {
			const userArea = new UserAreaComponent(page)
			await page.mouse.click(10, 10)
			await expect(userArea.profilePhoto).toBeVisible()
		})
	})
})
