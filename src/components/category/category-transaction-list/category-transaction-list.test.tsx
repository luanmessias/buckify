import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Transaction } from "@/lib/types"
import { CategoryTransactionList } from "./category-transaction-list"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

describe("CategoryTransactionList", () => {
	const mockTransactions: Transaction[] = [
		{
			id: "1",
			description: "Transaction 1",
			amount: 50.0,
			date: "2023-10-27",
			categoryId: "cat1",
		},
		{
			id: "2",
			description: "Transaction 2",
			amount: 25.0,
			date: "2023-10-28",
			categoryId: "cat1",
		},
	]

	it("should render a list of transactions sorted by date descending", () => {
		render(<CategoryTransactionList transactions={mockTransactions} />)

		const items = screen.getAllByText(/Transaction \d/)
		expect(items).toHaveLength(2)
		expect(items[0]).toHaveTextContent("Transaction 2")
		expect(items[1]).toHaveTextContent("Transaction 1")
	})
})
