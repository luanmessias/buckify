import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { Suspense } from "react"
import { describe, expect, it } from "vitest"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"
import DashboardPage from "./page"

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<NextIntlClientProvider locale="pt" messages={{}}>
		<ApolloWrapper>
			<Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
		</ApolloWrapper>
	</NextIntlClientProvider>
)

describe("DashboardPage", () => {
	it("should render the transaction list from the mocked API", async () => {
		render(
			<TestWrapper>
				<DashboardPage />
			</TestWrapper>,
		)

		await screen.findByText("Carregando...")

		const salaryItem = await screen.findByText("Salario Mockado")
		const netflixItem = await screen.findByText("Netflix Mockado")

		expect(salaryItem).toBeInTheDocument()
		expect(netflixItem).toBeInTheDocument()
	})

	it("should render the summary with correct total spent", async () => {
		render(
			<TestWrapper>
				<DashboardPage />
			</TestWrapper>,
		)

		await screen.findByText("Carregando...")

		const totalSpent = await screen.findByText("€ 5.039,90")
		expect(totalSpent).toBeInTheDocument()
	})
})
