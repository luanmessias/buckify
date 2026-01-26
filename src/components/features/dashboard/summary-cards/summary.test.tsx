import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, it, vi } from "vitest"
import messages from "@/messages/en.json"
import { Summary } from "./summary"

vi.mock("recharts", async () => {
	const OriginalModule = await vi.importActual("recharts")
	return {
		...OriginalModule,
		ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
			<div
				data-testid="responsive-container"
				style={{ width: 500, height: 500 }}
			>
				{children}
			</div>
		),
		PieChart: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="pie-chart">{children}</div>
		),
		Pie: ({
			data,
			children,
		}: {
			data: { id: string; name: string; value: number }[]
			children: React.ReactNode
		}) => (
			<div data-testid="pie-component">
				{data.map((item) => (
					<div key={item.id} data-testid={`pie-slice-${item.name}`}>
						{item.name}: {item.value}
					</div>
				))}
				{children}
			</div>
		),
		Cell: ({ fill }: { fill: string }) => <div data-testid={`cell-${fill}`} />,
		Tooltip: ({
			formatter,
		}: {
			formatter: (value: number | undefined) => string
		}) => (
			<div data-testid="tooltip">
				{formatter(100)} {formatter(undefined)}{" "}
			</div>
		),
	}
})

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

describe("Summary Component", () => {
	beforeEach(() => {
		global.ResizeObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn(),
		}))
	})

	it("should calculate and display total totals correctly", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<Summary transactions={mockTransactions} categories={mockCategories} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText(/€\s*1\.500,00/)).toBeInTheDocument()

		const spentElements = screen.getAllByText(/€\s*350,00/)
		expect(spentElements.length).toBeGreaterThan(0)

		expect(screen.getByText(/€\s*1\.150,00/)).toBeInTheDocument()
	})

	it("should pass correct data to the Chart", () => {
		render(
			<Summary transactions={mockTransactions} categories={mockCategories} />,
		)

		expect(screen.getByTestId("pie-slice-Casa")).toHaveTextContent("Casa: 250")
		expect(screen.getByTestId("pie-slice-Lazer")).toHaveTextContent(
			"Lazer: 100",
		)
	})

	it("should handle empty state (no transactions) gracefully", () => {
		render(<Summary transactions={[]} categories={mockCategories} />)

		const zeroElements = screen.getAllByText(/€\s*0,00/)
		expect(zeroElements.length).toBeGreaterThan(0)

		const remainingElements = screen.getAllByText(/€\s*1\.500,00/)
		expect(remainingElements.length).toBeGreaterThan(0)
	})

	it("should handle overspent budget correctly", () => {
		const overspentTransactions = [
			{
				id: "t1",
				amount: 1600,
				categoryId: "cat1",
				description: "Aluguel",
				date: "2024-05-01",
				category: "Casa",
			},
		]

		render(
			<Summary
				transactions={overspentTransactions}
				categories={mockCategories}
			/>,
		)

		const spentElements = screen.getAllByText(/€\s*1\.600,00/)
		expect(spentElements.length).toBeGreaterThan(0)

		expect(screen.getByText(/-€\s*100,00/)).toBeInTheDocument()
	})

	it("should display top categories list and hidden message when more than 3", () => {
		const moreCategories = [
			...mockCategories,
			{
				id: "cat3",
				name: "Transporte",
				slug: "transporte",
				budget: 300,
				color: "#blue",
				icon: "Car",
				description: "",
				householdId: "",
			},
			{
				id: "cat4",
				name: "Alimentacao",
				slug: "alimentacao",
				budget: 400,
				color: "#green",
				icon: "Food",
				description: "",
				householdId: "",
			},
			{
				id: "cat5",
				name: "Saude",
				slug: "saude",
				budget: 200,
				color: "",
				icon: "",
				description: "",
				householdId: "",
			},
		]

		const moreTransactions = [
			...mockTransactions,
			{
				id: "t4",
				amount: 150,
				categoryId: "cat3",
				description: "Gasolina",
				date: "2024-05-04",
				category: "Transporte",
			},
			{
				id: "t5",
				amount: 200,
				categoryId: "cat4",
				description: "Mercado",
				date: "2024-05-05",
				category: "Alimentacao",
			},
			{
				id: "t6",
				amount: 50,
				categoryId: "cat5",
				description: "Consulta",
				date: "2024-05-06",
				category: "Saude",
			},
		]

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<Summary transactions={moreTransactions} categories={moreCategories} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("Casa")).toBeInTheDocument()
		expect(screen.getByText("Alimentacao")).toBeInTheDocument()
		expect(screen.getByText("Transporte")).toBeInTheDocument()

		expect(screen.getByText(/hidden_categories/)).toBeInTheDocument()
	})
})
