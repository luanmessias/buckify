import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Transaction } from "@/lib/types"
import { CategoryTransactionList } from "./category-transaction-list"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("@apollo/client/react", () => ({
	useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
	useSuspenseQuery: vi.fn(() => ({
		data: {
			getCategories: [
				{ id: "cat1", name: "Category 1" },
				{ id: "cat2", name: "Category 2" },
			],
		},
	})),
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

	it("should render a list of transactions in the provided order", () => {
		render(
			<CategoryTransactionList
				transactions={mockTransactions}
				householdId="test-household"
			/>,
		)

		const items = screen.getAllByText(/Transaction \d/)
		expect(items).toHaveLength(2)
		expect(items[0]).toHaveTextContent("Transaction 1")
		expect(items[1]).toHaveTextContent("Transaction 2")
	})

	it("should render 'no transactions found' when the list is empty", () => {
		render(
			<CategoryTransactionList
				transactions={[]}
				householdId="test-household"
			/>,
		)

		expect(screen.getByText("no_transactions_found")).toBeInTheDocument()
	})
})
