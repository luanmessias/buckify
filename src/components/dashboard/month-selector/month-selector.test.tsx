import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ptBR } from "date-fns/locale"
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import messages from "@/messages/pt.json"
import { MonthSelector } from "./month-selector"

const mockReplace = vi.fn()
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
	usePathname: () => "/dashboard",
	useSearchParams: vi.fn(),
}))

vi.mock("@/hooks/use-date-fns-locale", () => ({
	useDateFnsLocale: () => ptBR,
}))

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

const renderWithProviders = (ui: React.ReactElement) => {
	return render(
		<NextIntlClientProvider locale="pt" messages={messages}>
			{ui}
		</NextIntlClientProvider>,
	)
}

describe("MonthSelector Component", () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["Date"] })
		vi.setSystemTime(new Date("2024-05-15"))
		mockReplace.mockClear()
		vi.mocked(useSearchParams).mockReturnValue(
			new URLSearchParams(
				"month=2024-05",
			) as unknown as ReadonlyURLSearchParams,
		)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should render the current month label from URL", () => {
		renderWithProviders(<MonthSelector className="" />)
		expect(screen.getByText(/maio 2024/i)).toBeInTheDocument()
	})

	it("should render default month if URL param is missing", () => {
		vi.mocked(useSearchParams).mockReturnValue(
			new URLSearchParams() as unknown as ReadonlyURLSearchParams,
		)
		renderWithProviders(<MonthSelector className="" />)
		expect(screen.getByText(/maio 2024/i)).toBeInTheDocument()
	})

	it("should open drawer/popover and show year and months", async () => {
		const user = userEvent.setup()
		renderWithProviders(<MonthSelector className="" />)

		const trigger = screen.getByRole("button", { name: /maio 2024/i })
		await user.click(trigger)

		const dialog = screen.getByRole("dialog")
		expect(dialog).toBeInTheDocument()

		expect(screen.getByText("select_month")).toBeInTheDocument()

		expect(within(dialog).getByText("2024")).toBeInTheDocument()

		expect(
			within(dialog).getByRole("button", { name: /jan/i }),
		).toBeInTheDocument()
		expect(
			within(dialog).getByRole("button", { name: /mai/i }),
		).toBeInTheDocument()
	})

	it("should navigate years", async () => {
		const user = userEvent.setup()
		renderWithProviders(<MonthSelector className="" />)

		await user.click(screen.getByRole("button", { name: /maio 2024/i }))
		const dialog = screen.getByRole("dialog")

		const prevYearBtn = within(dialog).getByRole("button", {
			name: /previous year/i,
		})
		await user.click(prevYearBtn)

		expect(within(dialog).getByText("2023")).toBeInTheDocument()

		const nextYearBtn = within(dialog).getByRole("button", {
			name: /next year/i,
		})
		await user.click(nextYearBtn)

		expect(within(dialog).getByText("2024")).toBeInTheDocument()
	})

	it("should select a month and update URL", async () => {
		const user = userEvent.setup()
		renderWithProviders(<MonthSelector className="" />)

		await user.click(screen.getByRole("button", { name: /maio 2024/i }))
		const dialog = screen.getByRole("dialog")

		const janButton = within(dialog).getByRole("button", { name: /jan/i })
		await user.click(janButton)

		expect(mockReplace).toHaveBeenCalledWith("/dashboard?month=2024-01")
	})

	it("should disable future months", async () => {
		const user = userEvent.setup()

		renderWithProviders(<MonthSelector className="" />)

		await user.click(screen.getByRole("button", { name: /maio 2024/i }))
		const dialog = screen.getByRole("dialog")

		const julyButton = within(dialog).getByRole("button", { name: /jul/i })
		expect(julyButton).toBeDisabled()
	})
})
