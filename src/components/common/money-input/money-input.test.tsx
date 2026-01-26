import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { MoneyInput } from "./money-input"

describe("MoneyInput", () => {
	it("should render with formatted value", () => {
		render(<MoneyInput value={123.45} onValueChange={vi.fn()} />)
		const input = screen.getByRole("textbox")
		expect(input).toHaveValue("123.45")
	})

	it("should call onValueChange when input changes", async () => {
		const onChange = vi.fn()
		const user = userEvent.setup()
		render(<MoneyInput value={0} onValueChange={onChange} />)

		const input = screen.getByRole("textbox")
		await user.clear(input)
		await user.type(input, "50.5")

		expect(onChange).toHaveBeenCalledWith(50.5)
	})

	it("should handle comma as decimal separator", async () => {
		const onChange = vi.fn()
		const user = userEvent.setup()
		render(<MoneyInput value={0} onValueChange={onChange} />)

		const input = screen.getByRole("textbox")
		await user.clear(input)
		await user.type(input, "50,5")

		expect(onChange).toHaveBeenCalledWith(50.5)
	})

	it("should reset to 0 when input is cleared", async () => {
		const onChange = vi.fn()
		const user = userEvent.setup()
		render(<MoneyInput value={10} onValueChange={onChange} />)

		const input = screen.getByRole("textbox")
		await user.clear(input)

		expect(onChange).toHaveBeenCalledWith(0)
	})

	it("should format value on blur", async () => {
		const onChange = vi.fn()
		render(<MoneyInput value={10} onValueChange={onChange} />)

		const input = screen.getByRole("textbox")
		fireEvent.change(input, { target: { value: "10.5" } })
		fireEvent.blur(input)

		expect(input).toHaveValue("10.00")
	})
})
