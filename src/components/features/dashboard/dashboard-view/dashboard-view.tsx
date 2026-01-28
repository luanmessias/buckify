"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { ArrowDownAZ, DollarSign, Wallet } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import type {
	SortDirection,
	SortOptionItem,
} from "@/components/common/list-filter/list-filter"
import { ListFilter } from "@/components/common/list-filter/list-filter"
import { CategoryList } from "@/components/features/categories/components/category-list/category-list"
import { Summary } from "@/components/features/dashboard/summary-cards/summary"
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
	const t = useTranslations("Categories")
	const _tCommon = useTranslations("Common")
	const tSort = useTranslations("Category")
	const dispatch = useAppDispatch()

	const searchParams = useSearchParams()
	const currentMonth =
		searchParams.get("month") || format(new Date(), "yyyy-MM")

	const parsedDate = parseISO(currentMonth)
	const startDate = format(startOfMonth(parsedDate), "yyyy-MM-dd")
	const endDate = format(endOfMonth(parsedDate), "yyyy-MM-dd")

	const [searchTerm, setSearchTerm] = useState("")
	const [sortBy, setSortBy] = useState("spent")
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

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

	const sortOptions: SortOptionItem[] = [
		{
			value: "spent",
			labelAsc: t("sort_spent_asc"),
			labelDesc: t("sort_spent_desc"),
			icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
		},
		{
			value: "budget",
			labelAsc: t("sort_budget_asc"),
			labelDesc: t("sort_budget_desc"),
			icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
		},
		{
			value: "name",
			labelAsc: t("sort_name_asc"),
			labelDesc: t("sort_name_desc"),
			icon: <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />,
		},
	]

	const filteredCategories = useMemo(() => {
		let processed = data.getCategories.map((category) => {
			const amount = data.getTransactions
				.filter((t) => t.categoryId === category.id)
				.reduce((acc, t) => acc + t.amount, 0)

			return {
				...category,
				value: amount,
			}
		})

		if (searchTerm) {
			processed = processed.filter((c) =>
				c.name.toLowerCase().includes(searchTerm.toLowerCase()),
			)
		}

		processed.sort((a, b) => {
			let comparison = 0
			switch (sortBy) {
				case "spent":
					comparison = a.value - b.value
					break
				case "budget":
					comparison = a.budget - b.budget
					break
				case "name":
					comparison = a.name.localeCompare(b.name)
					break
			}
			return sortDirection === "asc" ? comparison : -comparison
		})

		return processed
	}, [
		data.getCategories,
		data.getTransactions,
		searchTerm,
		sortBy,
		sortDirection,
	])

	return (
		<div className="flex flex-col gap-4 py-4">
			<Summary
				transactions={data.getTransactions}
				categories={data.getCategories}
			/>

			<div className="px-4">
				<ListFilter
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					sortBy={sortBy}
					onSortChange={setSortBy}
					sortDirection={sortDirection}
					onSortDirectionChange={setSortDirection}
					sortOptions={sortOptions}
					searchPlaceholder={t("search_categories")}
					title={tSort("filter_title")}
				/>
			</div>

			<CategoryList data={filteredCategories} />
		</div>
	)
}
