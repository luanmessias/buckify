"use client"

import { Filter, Search } from "lucide-react"
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

export type SortDirection = "asc" | "desc"

export interface SortOptionItem {
	value: string
	labelAsc: string
	labelDesc: string
	icon?: React.ReactNode
}

interface ListFilterProps {
	searchTerm: string
	onSearchChange: (value: string) => void
	sortBy: string
	onSortChange: (value: string) => void
	sortDirection: SortDirection
	onSortDirectionChange: (value: SortDirection) => void
	sortOptions: SortOptionItem[]
	searchPlaceholder?: string
	title?: string
}

export const ListFilter = ({
	searchTerm,
	onSearchChange,
	sortBy,
	onSortChange,
	sortDirection,
	onSortDirectionChange,
	sortOptions,
	searchPlaceholder,
	title,
}: ListFilterProps) => {
	const t = useTranslations("Category")

	const handleSortChange = (value: string) => {
		const lastIndex = value.lastIndexOf("-")
		const field = value.substring(0, lastIndex)
		const direction = value.substring(lastIndex + 1) as SortDirection

		onSortChange(field)
		onSortDirectionChange(direction)
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 px-1">
				<Filter className="h-4 w-4 text-primary" />
				<Typography variant="h4" className="font-semibold text-base md:text-lg">
					{title || t("filter_title")}
				</Typography>
			</div>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={searchPlaceholder || t("search_transactions")}
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="w-37.5">
					<Select
						value={`${sortBy}-${sortDirection}`}
						onValueChange={handleSortChange}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("sort_by")} />
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map((option) => (
								<div key={option.value}>
									<SelectItem value={`${option.value}-desc`}>
										<div className="flex items-center gap-2">
											{option.icon}
											<span className="truncate">{option.labelDesc}</span>
										</div>
									</SelectItem>
									<SelectItem value={`${option.value}-asc`}>
										<div className="flex items-center gap-2">
											{option.icon}
											<span className="truncate">{option.labelAsc}</span>
										</div>
									</SelectItem>
								</div>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}
