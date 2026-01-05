import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { Suspense } from "react"
import { Provider } from "react-redux"
import { describe, expect, it, vi } from "vitest"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"
import { makeStore } from "@/lib/store"
import DashboardPage from "./page"

vi.mock("next/headers", () => ({
	cookies: vi.fn(() => ({
		get: vi.fn(() => ({ value: "some-household-id" })),
	})),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
	const store = makeStore()
	return (
		<Provider store={store}>
			<NextIntlClientProvider locale="pt" messages={{}}>
				<ApolloWrapper>
					<Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
				</ApolloWrapper>
			</NextIntlClientProvider>
		</Provider>
	)
}

describe("DashboardPage", () => {
	it("should render the category list from the mocked API", async () => {
		render(
			<TestWrapper>
				<DashboardPage />
			</TestWrapper>,
		)

		const receitaCategories = await screen.findAllByText("Receita")
		const assinaturaCategories = await screen.findAllByText("Assinatura")

		expect(receitaCategories.length).toBeGreaterThan(0)
		expect(assinaturaCategories.length).toBeGreaterThan(0)
	})

	it("should render the summary with correct total spent", async () => {
		render(
			<TestWrapper>
				<DashboardPage />
			</TestWrapper>,
		)

		const totalSpent = await screen.findByText("€ 5.039,90")
		expect(totalSpent).toBeInTheDocument()
	})
})
