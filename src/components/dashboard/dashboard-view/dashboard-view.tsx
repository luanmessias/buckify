"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { useEffect, useState } from "react"
import { MonthOptions } from "@/components/transactions/month-options/month-options"
import { Summary } from "@/components/transactions/summary/summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setCategories } from "@/lib/features/categories/categories-slice"
import { useAppDispatch } from "@/lib/hooks"
import type { Category, Transaction } from "@/lib/types"

interface GetTransactionsData {
	getTransactions: Transaction[]
	getCategories: Category[]
}

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($startDate: String!, $endDate: String!, $householdId: String!) {
    getTransactions(startDate: $startDate, endDate: $endDate, householdId: $householdId) {
      id
      description
      amount
      categoryId
      date
    }
    
    getCategories(householdId: $householdId) {
      id
      name
      budget
      color
      icon
    }
  }
`

interface DashboardViewProps {
	householdId: string
}

export function DashboardView({ householdId }: DashboardViewProps) {
	const dispatch = useAppDispatch()
	const [currentMonth, setCurrentMonth] = useState(
		format(new Date(), "yyyy-MM"),
	)

	const parsedDate = parseISO(currentMonth)
	const startDate = format(startOfMonth(parsedDate), "yyyy-MM-dd")
	const endDate = format(endOfMonth(parsedDate), "yyyy-MM-dd")

	const { data } = useSuspenseQuery<GetTransactionsData>(GET_DASHBOARD_DATA, {
		variables: {
			startDate,
			endDate,
			householdId: householdId,
		},
	})

	useEffect(() => {
		if (data.getCategories) {
			dispatch(setCategories(data.getCategories))
		}
	}, [data.getCategories, dispatch])

	const handleMonthChange = (month: string) => {
		setCurrentMonth(month)
	}

	return (
		<div className="space-y-4">
			<MonthOptions month={currentMonth} onSelectDate={handleMonthChange} />

			<Summary
				transactions={data.getTransactions}
				categories={data.getCategories}
			/>

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
								{t.categoryId} • {t.date}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
