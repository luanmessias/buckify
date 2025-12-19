import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, it, vi } from "vitest"
import messages from "@/messages/pt.json"
import { Summary } from "./summary"

// --- MOCKS ---

// 1. Mock do Recharts (Crucial para não quebrar o teste)
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
		Pie: ({ data, children }: { data: any[]; children: React.ReactNode }) => (
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
				{/* Call formatter to cover it */}
			</div>
		),
	}
})

// 2. Mock do CategoryCard para simplificar (teste de integração leve)
// Se preferir testar a integração real, pode remover este mock e mockar só o Icon
vi.mock("../category-summary/category-card", () => ({
	CategoryCard: ({ name, amountSpent, icon }: any) => (
		<div data-testid={`card-${name}`}>
			{name} - {amountSpent} - {icon || "MoreHorizontal"}
		</div>
	),
}))

// --- DADOS DE TESTE ---

const mockCategories = [
	{
		id: "cat1",
		name: "Casa",
		budget: 1000,
		color: "#000",
		icon: "Home",
		description: "",
		houseHoldId: "",
	},
	{
		id: "cat2",
		name: "Lazer",
		budget: 500,
		color: "#fff",
		icon: "Party",
		description: "",
		houseHoldId: "",
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
	// Mock do ResizeObserver que o Recharts usa internamente
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

		// Total Budget: 1000 + 500 = 1500
		expect(screen.getByText(/€\s*1\.500,00/)).toBeInTheDocument()

		// Total Spent: 200 + 50 + 100 = 350
		// Nota: O valor aparece duas vezes (no centro do gráfico e na lista), usamos getAllByText
		const spentElements = screen.getAllByText(/€\s*350,00/)
		expect(spentElements.length).toBeGreaterThan(0)

		// Remaining: 1500 - 350 = 1150
		expect(screen.getByText(/€\s*1\.150,00/)).toBeInTheDocument()
	})

	it("should pass correct data to the Chart", () => {
		render(
			<Summary transactions={mockTransactions} categories={mockCategories} />,
		)

		// Verifica se o mock do Pie renderizou as fatias corretas
		// Casa gastou 250 (200+50)
		expect(screen.getByTestId("pie-slice-Casa")).toHaveTextContent("Casa: 250")
		// Lazer gastou 100
		expect(screen.getByTestId("pie-slice-Lazer")).toHaveTextContent(
			"Lazer: 100",
		)
	})

	it("should render the category cards grid", () => {
		render(
			<Summary transactions={mockTransactions} categories={mockCategories} />,
		)

		expect(screen.getByTestId("card-Casa")).toBeInTheDocument()
		expect(screen.getByTestId("card-Lazer")).toBeInTheDocument()
	})

	it("should handle empty state (no transactions) gracefully", () => {
		render(<Summary transactions={[]} categories={mockCategories} />)

		// Gasto total 0
		const zeroElements = screen.getAllByText(/€\s*0,00/)
		expect(zeroElements.length).toBeGreaterThan(0)

		// Restante deve ser igual ao budget total (1500)
		const remainingElements = screen.getAllByText(/€\s*1\.500,00/)
		expect(remainingElements.length).toBeGreaterThan(0)
	})

	it("should handle overspent budget correctly", () => {
		const overspentTransactions = [
			{
				id: "t1",
				amount: 1600, // Overspent total
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

		// Total Spent: 1600
		const spentElements = screen.getAllByText(/€\s*1\.600,00/)
		expect(spentElements.length).toBeGreaterThan(0)

		// Remaining: 1500 - 1600 = -100 (negative)
		expect(screen.getByText(/-€\s*100,00/)).toBeInTheDocument()
	})

	it("should display top categories list and hidden message when more than 3", () => {
		const moreCategories = [
			...mockCategories,
			{
				id: "cat3",
				name: "Transporte",
				budget: 300,
				color: "#blue",
				icon: "Car",
				description: "",
				houseHoldId: "",
			},
			{
				id: "cat4",
				name: "Alimentacao",
				budget: 400,
				color: "#green",
				icon: "Food",
				description: "",
				houseHoldId: "",
			},
			{
				id: "cat5",
				name: "Saude",
				budget: 200,
				color: "", // To cover the || in Cell fill
				icon: "", // To cover the || in icon
				description: "",
				houseHoldId: "",
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
			// cat5 has no transactions, value=0, filtered out
		]

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<Summary transactions={moreTransactions} categories={moreCategories} />
			</NextIntlClientProvider>,
		)

		// Should display top 3 categories in the list
		expect(screen.getByText("Casa")).toBeInTheDocument()
		expect(screen.getByText("Alimentacao")).toBeInTheDocument()
		expect(screen.getByText("Transporte")).toBeInTheDocument()

		// Should show the hidden message since there are 4 categories (cat5 filtered out)
		expect(screen.getByText(/hidden_categories/)).toBeInTheDocument()
	})
})
