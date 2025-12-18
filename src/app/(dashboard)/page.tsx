"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { useState } from "react"
import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog/create-transaction-dialog"
import { MonthOptions } from "@/components/transactions/month-options/month-options"
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
  query GetDashboardTransactions($startDate: String!, $endDate: String!) {
    getTransactions(startDate: $startDate, endDate: $endDate) {
      id
      description
      amount
      categoryId
      date
    }
  }
`

export default function DashboardPage() {
	const [currentMonth, setCurrentMonth] = useState(
		format(new Date(), "yyyy-MM"),
	)

	const parsedDate = parseISO(currentMonth)
	const startDate = startOfMonth(parsedDate).toISOString()
	const endDate = endOfMonth(parsedDate).toISOString()

	const { data } = useSuspenseQuery<GetTransactionsData>(GET_TRANSACTIONS, {
		variables: {
			startDate,
			endDate,
		},
	})

	const handleMonthChange = (month: string) => {
		setCurrentMonth(month)
	}

	return (
		<div className="space-y-4">
			<MonthOptions month={currentMonth} onSelectDate={handleMonthChange} />
			<h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

			<div className="grid p-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{data.getTransactions.map((t: Transaction) => (
					<Card key={t.id}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{t.description}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
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

			<CreateTransactionDialog />
		</div>
	)
}
