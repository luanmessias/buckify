"use client"

import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export type SortOption = "date" | "amount" | "description"
export type SortDirection = "asc" | "desc"

interface CategoryFilterProps {
	searchTerm: string
	onSearchChange: (value: string) => void
	sortBy: SortOption
	onSortChange: (value: SortOption) => void
	sortDirection: SortDirection
	onSortDirectionChange: (value: SortDirection) => void
}

export const CategoryFilter = ({
	searchTerm,
	onSearchChange,
	sortBy,
	onSortChange,
	sortDirection,
	onSortDirectionChange,
}: CategoryFilterProps) => {
	const t = useTranslations("Category")
	const _tCommon = useTranslations("Common")

	const handleSortChange = (value: string) => {
		const [field, direction] = value.split("-") as [SortOption, SortDirection]
		onSortChange(field)
		onSortDirectionChange(direction)
	}

	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
			<div className="relative flex-1">
				<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder={t("search_transactions")}
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>
			<div className="w-full sm:w-[200px]">
				<Select
					value={`${sortBy}-${sortDirection}`}
					onValueChange={handleSortChange}
				>
					<SelectTrigger>
						<SelectValue placeholder={t("sort_by")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="date-desc">{t("sort_date_desc")}</SelectItem>
						<SelectItem value="date-asc">{t("sort_date_asc")}</SelectItem>
						<SelectItem value="amount-desc">{t("sort_amount_desc")}</SelectItem>
						<SelectItem value="amount-asc">{t("sort_amount_asc")}</SelectItem>
						<SelectItem value="description-asc">
							{t("sort_description_asc")}
						</SelectItem>
						<SelectItem value="description-desc">
							{t("sort_description_desc")}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
