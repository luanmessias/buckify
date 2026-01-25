import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"
import messages from "@/messages/en.json"
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

const mockData = [
	{
		id: "cat1",
		name: "Casa",
		slug: "casa",
		budget: 1000,
		color: "#000",
		icon: "Home",
		description: "",
		householdId: "",
		value: 250,
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
		value: 100,
	},
]

describe("CategoryList Component", () => {
	it("should render the category cards grid with provided data", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList data={mockData} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByTestId("card-Casa")).toHaveTextContent("Casa - 250")
		expect(screen.getByTestId("card-Lazer")).toHaveTextContent("Lazer - 100")
	})

	it("should render categories with 0 spent", () => {
		const dataWithUnused = [
			...mockData,
			{
				id: "cat3",
				name: "Unused",
				slug: "unused",
				budget: 100,
				color: "#ccc",
				icon: "Ghost",
				description: "",
				householdId: "",
				value: 0,
			},
		]

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList data={dataWithUnused} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByTestId("card-Unused")).toBeInTheDocument()
	})

	it("should render in the provided order", () => {
		const sortedData = [...mockData].sort((a, b) => b.value - a.value)

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList data={sortedData} />
			</NextIntlClientProvider>,
		)

		const cards = screen.getAllByTestId(/^card-/)
		expect(cards[0]).toHaveTextContent("Casa")
		expect(cards[1]).toHaveTextContent("Lazer")

		const invertedData = [...mockData].sort((a, b) => a.value - b.value)

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryList data={invertedData} />
			</NextIntlClientProvider>,
		)

		const _cardsInverted = screen.getAllByTestId(/^card-/)

		expect(cards[0]).toHaveTextContent("Casa")
	})
})
