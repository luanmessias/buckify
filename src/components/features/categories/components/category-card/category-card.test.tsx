import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"
import messages from "@/messages/en.json"
import { CategoryCard } from "./category-card"

vi.mock("@/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}))

describe("CategoryCard Component", () => {
	const defaultProps = {
		id: "mercado-category",
		name: "Mercado",
		slug: "mercado",
		icon: "ShoppingCart",
		color: "#10b981",
		amountSpent: 200,
		budget: 1000,
	}

	it("should render the category information correctly", () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CategoryCard {...defaultProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("Mercado")).toBeInTheDocument()
		expect(screen.getByText("200,00 €")).toBeInTheDocument()
		expect(screen.getByText(/1000,00 €/)).toBeInTheDocument()
		expect(screen.getByText("remaining_label")).toBeInTheDocument()
		expect(screen.getByTestId("icon-ShoppingCart")).toBeInTheDocument()
	})

	it("should calculate percentage and remaining correctly (Healthy Budget)", () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CategoryCard {...defaultProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("20%")).toBeInTheDocument()
		expect(screen.getByText("20%")).toHaveClass("text-primary")

		expect(screen.getByText(/800,00.*€/)).toHaveClass(
			"text-emerald-600 dark:text-emerald-500",
		)
	})

	it("should handle over budget state correctly", () => {
		const overBudgetProps = {
			...defaultProps,
			amountSpent: 1200,
			budget: 1000,
		}

		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CategoryCard {...overBudgetProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("100%")).toBeInTheDocument()
		expect(screen.getByText("100%")).toHaveClass("text-destructive")

		expect(screen.getByText(/-200,00.*€/)).toBeInTheDocument()
		expect(screen.getByText(/-200,00.*€/)).toHaveClass("text-destructive")
	})

	it("should handle zero budget correctly", () => {
		const zeroBudgetProps = {
			...defaultProps,
			amountSpent: 0,
			budget: 0,
		}

		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CategoryCard {...zeroBudgetProps} />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("0%")).toBeInTheDocument()

		const remaining = screen.getByText((content, element) => {
			return (
				(content.includes("0,00") &&
					element?.classList.contains("font-mono")) ||
				false
			)
		})
		expect(remaining).toBeInTheDocument()
		expect(remaining).toHaveClass("text-emerald-600")
	})
})
