"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import type { Category, Transaction } from "@/lib/types"
import { CategoryHeader } from "../category-header/category-header"
import { CategorySummary } from "../category-summary/category-summary"
import { CategoryTransactionList } from "../category-transaction-list/category-transaction-list"

interface CategoryViewProps {
	categoryId: string
	householdId: string
}

interface GetCategoryDataResponse {
	getTransactions: Transaction[]
	getCategory: Category
}

const GET_CATEGORY_DATA = gql`
  query GetCategoryData($startDate: String!, $endDate: String!, $householdId: String!, $categoryId: String!) {
    getTransactions(startDate: $startDate, endDate: $endDate, householdId: $householdId, categoryId: $categoryId) {
      id
      description
      amount
      categoryId
      date
    }

    getCategory(id: $categoryId, householdId: $householdId) {
      id
      name
      budget
      color
      icon
    }
  }
`

export const CategoryView = ({
	categoryId,
	householdId,
}: CategoryViewProps) => {
	const _dispatch = useAppDispatch()
	const searchParams = useSearchParams()

	const currentMonth =
		searchParams.get("month") || format(new Date(), "yyyy-MM")
	const parsedDate = parseISO(currentMonth)
	const startDate = format(startOfMonth(parsedDate), "yyyy-MM-dd")
	const endDate = format(endOfMonth(parsedDate), "yyyy-MM-dd")

	const { data } = useSuspenseQuery<GetCategoryDataResponse>(
		GET_CATEGORY_DATA,
		{
			variables: {
				startDate,
				endDate,
				householdId,
				categoryId,
			},
			fetchPolicy: "cache-and-network",
		},
	)

	return (
		<div className="flex flex-col gap-4 p-4">
			<CategoryHeader category={data.getCategory} householdId={householdId} />
			<CategorySummary
				transactions={data.getTransactions}
				category={data.getCategory}
			/>
			<CategoryTransactionList
				transactions={data.getTransactions}
				householdId={householdId}
			/>
		</div>
	)
}
