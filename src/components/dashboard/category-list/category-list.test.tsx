import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"
import messages from "@/messages/pt.json"
import { CategoryList } from "./category-list"

vi.mock("../category-card/category-card", () => ({
	CategoryCard: ({
		name,
		amountSpent,
		icon,
	}: {
		name: string
		amountSpent: number
		icon: string
	}) => (
		<div data-testid={`card-${name}`}>
			{name} - {amountSpent} - {icon || "MoreHorizontal"}
		</div>
	),
}))

const mockCategories = [
	{
		id: "cat1",
		name: "Casa",
		slug: "casa",
		budget: 1000,
		color: "#000",
		icon: "Home",
		description: "",
		householdId: "",
	},
	{
		id: "cat2",
		name: "Lazer",
		slug: "lazer",
		budget: 500,
		color: "#fff",
		icon: "Party",
		description: "",
		householdId: "",
	},
]

const mockTransactions = [
	{
		id: "t1",
		amount: 200,
		categoryId: "cat1",
		description: "Aluguel",
		date: "2024-05-01",
		category: "Casa",
	},
	{
		id: "t2",
		amount: 50,
		categoryId: "cat1",
		description: "Luz",
		date: "2024-05-02",
		category: "Casa",
	},
	{
		id: "t3",
		amount: 100,
		categoryId: "cat2",
		description: "Cinema",
		date: "2024-05-03",
		category: "Lazer",
	},
]

describe("CategoryList Component", () => {
	it("should render the category cards grid with aggregated values", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList
					transactions={mockTransactions}
					categories={mockCategories}
				/>
			</NextIntlClientProvider>,
		)

		expect(screen.getByTestId("card-Casa")).toHaveTextContent("Casa - 250")

		expect(screen.getByTestId("card-Lazer")).toHaveTextContent("Lazer - 100")
	})

	it("should not render categories with 0 spent", () => {
		const transactionsWithUnusedCategory = [...mockTransactions]
		const unusedCategory = {
			id: "cat3",
			name: "Unused",
			slug: "unused",
			budget: 100,
			color: "#ccc",
			icon: "Ghost",
			description: "",
			householdId: "",
		}
		const categories = [...mockCategories, unusedCategory]

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList
					transactions={transactionsWithUnusedCategory}
					categories={categories}
				/>
			</NextIntlClientProvider>,
		)

		expect(screen.queryByTestId("card-Unused")).not.toBeInTheDocument()
	})

	it("should sort categories by spent amount (descending)", () => {
		const modifiedTransactions = [
			{
				id: "t1",
				amount: 100,
				categoryId: "cat1",
				description: "Aluguel",
				date: "2024-05-01",
				category: "Casa",
			},
			{
				id: "t3",
				amount: 500,
				categoryId: "cat2",
				description: "Cinema",
				date: "2024-05-03",
				category: "Lazer",
			},
		]

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList
					transactions={modifiedTransactions}
					categories={mockCategories}
				/>
			</NextIntlClientProvider>,
		)

		const cards = screen.getAllByTestId(/^card-/)
		expect(cards[0]).toHaveTextContent("Lazer")
		expect(cards[1]).toHaveTextContent("Casa")
	})
})
