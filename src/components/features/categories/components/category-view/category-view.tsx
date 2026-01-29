"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { ArrowDownAZ, Calendar, DollarSign } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import type {
	SortDirection,
	SortOptionItem,
} from "@/components/common/list-filter/list-filter"
import { ListFilter } from "@/components/common/list-filter/list-filter"
import { AnimatedWrapper } from "@/components/layout/wrappers/animated-wrapper/animated-wrapper"
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
	const t = useTranslations("Category")
	const _dispatch = useAppDispatch()
	const searchParams = useSearchParams()

	const [searchTerm, setSearchTerm] = useState("")
	const [sortBy, setSortBy] = useState("date")
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

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

	const sortOptions: SortOptionItem[] = [
		{
			value: "date",
			labelAsc: t("sort_date_asc"),
			labelDesc: t("sort_date_desc"),
			icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
		},
		{
			value: "amount",
			labelAsc: t("sort_amount_asc"),
			labelDesc: t("sort_amount_desc"),
			icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
		},
		{
			value: "description",
			labelAsc: t("sort_description_asc"),
			labelDesc: t("sort_description_desc"),
			icon: <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />,
		},
	]

	const filteredTransactions = useMemo(() => {
		let transactions = [...data.getTransactions]

		if (searchTerm) {
			transactions = transactions.filter((t) =>
				t.description.toLowerCase().includes(searchTerm.toLowerCase()),
			)
		}

		transactions.sort((a, b) => {
			let comparison = 0
			switch (sortBy) {
				case "date":
					comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
					break
				case "amount":
					comparison = a.amount - b.amount
					break
				case "description":
					comparison = a.description.localeCompare(b.description)
					break
			}
			return sortDirection === "asc" ? comparison : -comparison
		})

		return transactions
	}, [data.getTransactions, searchTerm, sortBy, sortDirection])

	return (
		<div className="flex flex-col gap-4 p-4">
			<CategoryHeader category={data.getCategory} householdId={householdId} />
			<CategorySummary
				transactions={data.getTransactions}
				category={data.getCategory}
			/>
			<div className="px-4">
				<AnimatedWrapper>
					<ListFilter
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						sortBy={sortBy}
						onSortChange={setSortBy}
						sortDirection={sortDirection}
						onSortDirectionChange={setSortDirection}
						sortOptions={sortOptions}
					/>
				</AnimatedWrapper>
			</div>
			<CategoryTransactionList
				transactions={filteredTransactions}
				householdId={householdId}
			/>
		</div>
	)
}
