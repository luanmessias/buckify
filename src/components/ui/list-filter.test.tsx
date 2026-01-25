import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ListFilter } from "./list-filter"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		onValueChange,
		value,
	}: {
		children: React.ReactNode
		onValueChange: (value: string) => void
		value: string
	}) => (
		<div data-testid="select">
			<span data-testid="select-value">{value}</span>
			<button
				type="button"
				onClick={() => onValueChange("date-desc")}
				data-testid="select-option-date-desc"
			>
				Date Desc
			</button>
			<button
				type="button"
				onClick={() => onValueChange("amount-asc")}
				data-testid="select-option-amount-asc"
			>
				Amount Asc
			</button>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => <div>Value</div>,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

describe("ListFilter", () => {
	const sortOptions = [
		{ value: "date", labelAsc: "Date Asc", labelDesc: "Date Desc" },
		{ value: "amount", labelAsc: "Amount Asc", labelDesc: "Amount Desc" },
	]

	it("should render search input and sort select", () => {
		render(
			<ListFilter
				searchTerm=""
				onSearchChange={vi.fn()}
				sortBy="date"
				onSortChange={vi.fn()}
				sortDirection="desc"
				onSortDirectionChange={vi.fn()}
				sortOptions={sortOptions}
			/>,
		)

		expect(
			screen.getByPlaceholderText("search_transactions"),
		).toBeInTheDocument()
		expect(screen.getByTestId("select")).toBeInTheDocument()
	})

	it("should call onSearchChange when input changes", () => {
		const onSearchChange = vi.fn()
		render(
			<ListFilter
				searchTerm=""
				onSearchChange={onSearchChange}
				sortBy="date"
				onSortChange={vi.fn()}
				sortDirection="desc"
				onSortDirectionChange={vi.fn()}
				sortOptions={sortOptions}
			/>,
		)

		const input = screen.getByPlaceholderText("search_transactions")
		fireEvent.change(input, { target: { value: "test" } })

		expect(onSearchChange).toHaveBeenCalledWith("test")
	})

	it("should call sorting callbacks when sort option changes", () => {
		const onSortChange = vi.fn()
		const onSortDirectionChange = vi.fn()

		render(
			<ListFilter
				searchTerm=""
				onSearchChange={vi.fn()}
				sortBy="date"
				onSortChange={onSortChange}
				sortDirection="desc"
				onSortDirectionChange={onSortDirectionChange}
				sortOptions={sortOptions}
			/>,
		)

		const option = screen.getByTestId("select-option-amount-asc")
		fireEvent.click(option)

		expect(onSortChange).toHaveBeenCalledWith("amount")
		expect(onSortDirectionChange).toHaveBeenCalledWith("asc")
	})
})
