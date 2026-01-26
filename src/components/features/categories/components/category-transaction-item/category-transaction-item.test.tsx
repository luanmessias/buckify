import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Transaction } from "@/lib/types"
import { CategoryTransactionItem } from "./category-transaction-item"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

describe("CategoryTransactionItem", () => {
	const mockTransaction: Transaction = {
		id: "1",
		description: "Test Transaction",
		amount: 50.0,
		date: "2023-10-27",
		categoryId: "cat1",
	}

	it("should render transaction details correctly", () => {
		render(<CategoryTransactionItem transaction={mockTransaction} />)

		expect(screen.getByText("Test Transaction")).toBeInTheDocument()
		expect(screen.getByText("27/10/2023")).toBeInTheDocument()
	})

	it("should call onEdit when clicked", () => {
		const onEdit = vi.fn()
		render(
			<CategoryTransactionItem transaction={mockTransaction} onEdit={onEdit} />,
		)

		fireEvent.click(screen.getByText("Test Transaction"))
		expect(onEdit).toHaveBeenCalledWith(mockTransaction)
	})
})
