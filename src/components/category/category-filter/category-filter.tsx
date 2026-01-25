"use client"

import { ArrowDownAZ, Calendar, DollarSign, Filter, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"

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

	const handleSortChange = (value: string) => {
		const [field, direction] = value.split("-") as [SortOption, SortDirection]
		onSortChange(field)
		onSortDirectionChange(direction)
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 px-1">
				<Filter className="h-4 w-4 text-primary" />
				<Typography variant="h4" className="font-semibold text-base md:text-lg">
					{t("filter_title")}
				</Typography>
			</div>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("search_transactions")}
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="w-[150px]">
					<Select
						value={`${sortBy}-${sortDirection}`}
						onValueChange={handleSortChange}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("sort_by")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date-desc">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_date_desc")}</span>
								</div>
							</SelectItem>
							<SelectItem value="date-asc">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_date_asc")}</span>
								</div>
							</SelectItem>
							<SelectItem value="amount-desc">
								<div className="flex items-center gap-2">
									<DollarSign className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_amount_desc")}</span>
								</div>
							</SelectItem>
							<SelectItem value="amount-asc">
								<div className="flex items-center gap-2">
									<DollarSign className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_amount_asc")}</span>
								</div>
							</SelectItem>
							<SelectItem value="description-asc">
								<div className="flex items-center gap-2">
									<ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_description_asc")}</span>
								</div>
							</SelectItem>
							<SelectItem value="description-desc">
								<div className="flex items-center gap-2">
									<ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
									<span className="truncate">{t("sort_description_desc")}</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}
