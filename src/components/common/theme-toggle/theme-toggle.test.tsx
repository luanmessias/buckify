import { fireEvent, render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "./theme-toggle"

vi.mock("next-themes", () => ({
	useTheme: vi.fn(),
}))

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

describe("ThemeToggle", () => {
	const setThemeMock = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		;(useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			setTheme: setThemeMock,
			resolvedTheme: "light",
		})
	})

	it("renders correctly", () => {
		render(<ThemeToggle />)
		const button = screen.getByRole("button", { name: "theme_toggle_button" })
		expect(button).toBeInTheDocument()
	})

	it("toggles to dark mode when clicked and current theme is light", () => {
		render(<ThemeToggle />)
		const button = screen.getByRole("button", { name: "theme_toggle_button" })
		fireEvent.click(button)
		expect(setThemeMock).toHaveBeenCalledWith("dark")
	})

	it("toggles to light mode when clicked and current theme is dark", () => {
		;(useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			setTheme: setThemeMock,
			resolvedTheme: "dark",
		})
		render(<ThemeToggle />)
		const button = screen.getByRole("button", { name: "theme_toggle_button" })
		fireEvent.click(button)
		expect(setThemeMock).toHaveBeenCalledWith("light")
	})
})
