"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { CategoryList } from "@/components/dashboard/category-list/category-list"
import { Summary } from "@/components/dashboard/summary/summary"
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

	const searchParams = useSearchParams()
	const currentMonth =
		searchParams.get("month") || format(new Date(), "yyyy-MM")

	const parsedDate = parseISO(currentMonth)
	const startDate = format(startOfMonth(parsedDate), "yyyy-MM-dd")
	const endDate = format(endOfMonth(parsedDate), "yyyy-MM-dd")

	const { data } = useSuspenseQuery<GetTransactionsData>(GET_DASHBOARD_DATA, {
		variables: {
			startDate,
			endDate,
			householdId,
		},
	})

	useEffect(() => {
		if (data.getCategories) {
			dispatch(setCategories(data.getCategories))
		}
	}, [data.getCategories, dispatch])

	return (
		<div className="flex flex-col gap-4 py-4">
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
