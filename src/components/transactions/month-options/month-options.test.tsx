import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ptBR } from "date-fns/locale"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MonthOptions } from "./month-options"

vi.mock("@/hooks/use-date-fns-locale", () => ({
	useDateFnsLocale: () => ptBR,
}))

describe("MonthOptions Component", () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["Date"] })
		vi.setSystemTime(new Date("2024-05-15"))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should render the correct month labels", () => {
		const onSelectDate = vi.fn()
		render(<MonthOptions month="2024-05" onSelectDate={onSelectDate} />)

		expect(screen.getByText(/maio 2024/i)).toBeInTheDocument()
		expect(screen.getByText(/abr\.? 2024/i)).toBeInTheDocument()
		expect(screen.getByText(/jun\.? 2024/i)).toBeInTheDocument()
	})

	it("should call onSelectDate with previous month when prev button is clicked", async () => {
		const user = userEvent.setup()
		const onSelectDate = vi.fn()
		render(<MonthOptions month="2024-05" onSelectDate={onSelectDate} />)

		const prevButton = screen.getByText(/abr\.? 2024/i)
		await user.click(prevButton)

		expect(onSelectDate).toHaveBeenCalledWith("2024-04")
	})

	it("should call onSelectDate with next month when next button is clicked", async () => {
		const user = userEvent.setup()
		const onSelectDate = vi.fn()
		render(<MonthOptions month="2024-05" onSelectDate={onSelectDate} />)

		const nextButton = screen.getByText(/jun\.? 2024/i)
		await user.click(nextButton)

		expect(onSelectDate).toHaveBeenCalledWith("2024-06")
	})

	it("should disable next button if selected month is the future limit", async () => {
		const onSelectDate = vi.fn()

		render(<MonthOptions month="2024-06" onSelectDate={onSelectDate} />)

		const nextButton = screen.getByText(/jul\.? 2024/i)

		expect(nextButton).toBeDisabled()
		expect(nextButton).toHaveClass("cursor-not-allowed")
	})
})
