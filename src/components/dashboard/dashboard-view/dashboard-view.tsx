"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { useEffect, useState } from "react"
import { MonthOptions } from "@/components/dashboard/month-options/month-options"
import { Summary } from "@/components/dashboard/summary/summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setCategories } from "@/lib/features/categories/categories-slice"
import { useAppDispatch } from "@/lib/hooks"
import type { Category, Transaction } from "@/lib/types"
import { CategoryList } from "../category-list/category-list"

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
			slug
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
		<div className="flex flex-col gap-4">
			<MonthOptions month={currentMonth} onSelectDate={handleMonthChange} />

			<Summary
				transactions={data.getTransactions}
				categories={data.getCategories}
			/>

			<CategoryList
				transactions={data.getTransactions}
				categories={data.getCategories}
			/>
		</div>
	)
}
