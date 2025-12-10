"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
	id: string
	description: string
	amount: number
	category: string
	date: string
}

interface GetTransactionsData {
	getTransactions: Transaction[]
}

const GET_TRANSACTIONS = gql`
	query GetDashboardTransactions {
		getTransactions {
			id
			description
			amount
			categoryId
			date
		}
	}
`

export default function Home() {
	const { data } = useSuspenseQuery<GetTransactionsData>(GET_TRANSACTIONS)

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Loopando sobre os dados reais do Firebase! */}
				{data.getTransactions.map((t: Transaction) => (
					<Card key={t.id}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{t.description}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{/* Formatação simples de moeda */}
								{new Intl.NumberFormat("pt-PT", {
									style: "currency",
									currency: "EUR",
								}).format(t.amount)}
							</div>
							<p className="text-xs text-muted-foreground">
								{t.category} • {t.date}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
