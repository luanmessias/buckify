import { render, screen } from "@testing-library/react"
import type React from "react"

import { describe, expect, it, vi } from "vitest"
import type { Category, Transaction } from "@/lib/types"
import { CategorySummary } from "./category-summary"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock(
	"@/components/layout/wrappers/animated-wrapper/animated-wrapper",
	() => ({
		AnimatedWrapper: ({
			children,
			className,
		}: {
			children: React.ReactNode
			className?: string
		}) => (
			<div className={className} data-testid="animated-wrapper">
				{children}
			</div>
		),
	}),
)

vi.mock("recharts", () => ({
	ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	PieChart: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	Pie: () => <div>Pie</div>,
	Cell: () => <div>Cell</div>,
}))

describe("CategorySummary", () => {
	const mockCategory: Category = {
		id: "1",
		name: "Food",
		budget: 1000,
		icon: "burger",
		color: "red",
		householdId: "1",
		slug: "food",
		description: "Food expenses",
	}

	const mockTransactions: Transaction[] = [
		{
			id: "1",
			amount: 200,
			categoryId: "1",
			date: new Date().toISOString(),
			description: "Groceries",
		},
		{
			id: "2",
			amount: 300,
			categoryId: "1",
			date: new Date().toISOString(),
			description: "Dinner",
		},
	]

	it("renders correctly with given transactions", () => {
		render(
			<CategorySummary
				category={mockCategory}
				transactions={mockTransactions}
			/>,
		)

		expect(screen.getByText("Food")).toBeInTheDocument()
		expect(screen.getByText("50%")).toBeInTheDocument()
		expect(screen.getByText("used_of_budget")).toBeInTheDocument()
		expect(screen.getByText("total_spent")).toBeInTheDocument()
		expect(screen.getAllByText(/€\s+500,00/)).toHaveLength(2)
		expect(screen.getByText("remaining")).toBeInTheDocument()
	})

	it("handles over budget correctly", () => {
		const highTransactions = [
			...mockTransactions,
			{
				id: "3",
				amount: 600,
				categoryId: "1",
				date: new Date().toISOString(),
				description: "Extra",
			},
		]

		render(
			<CategorySummary
				category={mockCategory}
				transactions={highTransactions}
			/>,
		)

		expect(screen.getByText("110%")).toBeInTheDocument()
		expect(screen.getByText(/€\s+1.100,00/)).toBeInTheDocument()
		expect(screen.getByText(/-€\s+100,00/)).toBeInTheDocument()
		expect(screen.getByText(/-€\s+100,00/)).toHaveClass("text-destructive")
	})

	it("handles zero budget", () => {
		const zeroBudgetCategory = { ...mockCategory, budget: 0 }
		render(
			<CategorySummary
				category={zeroBudgetCategory}
				transactions={mockTransactions}
			/>,
		)

		expect(screen.getByText("0%")).toBeInTheDocument()
	})
})
