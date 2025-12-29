import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"
import messages from "@/messages/pt.json"
import { CategoryCard } from "./category-card"

vi.mock("@/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}))

describe("CategoryCard Component", () => {
	const defaultProps = {
		name: "Mercado",
		icon: "ShoppingCart",
		color: "#10b981",
		amountSpent: 200,
		budget: 1000,
	}

	it("should render the category information correctly", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryCard {...defaultProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("Mercado")).toBeInTheDocument()
		expect(screen.getByText(/200,00.*€.*spent/)).toBeInTheDocument()
		expect(screen.getByText(/1.*000,00.*€.*available/)).toBeInTheDocument()
		expect(screen.getByTestId("icon-ShoppingCart")).toBeInTheDocument()
	})

	it("should calculate percentage and remaining correctly (Healthy Budget)", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryCard {...defaultProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("20%")).toBeInTheDocument()
		expect(screen.getByText("20%")).toHaveClass("text-hades-300")

		expect(screen.getByText(/800,00.*€/)).toBeInTheDocument()
		expect(screen.getByText(/800,00.*€/)).toHaveClass("text-hades-300")
	})

	it("should handle over budget state correctly", () => {
		const overBudgetProps = {
			...defaultProps,
			amountSpent: 1200,
			budget: 1000,
		}

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CategoryCard {...overBudgetProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("100%")).toBeInTheDocument()
		expect(screen.getByText("100%")).toHaveClass("text-red-400")

		expect(screen.getByText(/-200,00.*€/)).toBeInTheDocument()
		expect(screen.getByText(/-200,00.*€/)).toHaveClass("text-red-400")
	})
})
