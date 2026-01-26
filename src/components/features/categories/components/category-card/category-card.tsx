"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Icon } from "@/components/ui/icon"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
	id: string
	name: string
	slug: string
	icon: string
	color: string
	amountSpent: number
	budget: number
}

export const CategoryCard = ({
	name,
	slug,
	icon,
	amountSpent,
	budget,
}: CategoryCardProps) => {
	const t = useTranslations("Transactions")
	const searchParams = useSearchParams()

	const queryString = searchParams.toString()
	const queryPrefix = queryString ? "?" : ""

	const percentage =
		budget === 0 ? 0 : Math.min((amountSpent / budget) * 100, 100)
	const remaining = budget - amountSpent
	const isOverBudget = remaining < 0

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(val)

	const radius = 45
	const strokeWidth = 5
	const circumference = 2 * Math.PI * radius

	const themeColorClass = isOverBudget ? "text-destructive" : "text-primary"
	const iconBgClass = isOverBudget ? "bg-destructive/10" : "bg-primary/10"

	return (
		<Link href={`/category/${slug}${queryPrefix}${queryString}`}>
			<div className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-border/40 bg-card p-3 transition-all hover:border-border/80 hover:bg-card/80 hover:shadow-sm">
				<div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
					<div
						className={cn(
							"z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
							iconBgClass,
							"text-foreground/80",
						)}
					>
						<Icon name={icon} className="h-6 w-6" />
					</div>

					<svg
						className="absolute h-full w-full -rotate-90 transform p-0.5"
						viewBox="0 0 100 100"
					>
						<title>{`${name} - ${percentage.toFixed(0)}% spent`}</title>
						<circle
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="currentColor"
							strokeWidth={strokeWidth}
							className="text-muted/20"
						/>
						<circle
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="currentColor"
							strokeWidth={strokeWidth}
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={
								circumference - (percentage / 100) * circumference
							}
							className={cn(
								"transition-all duration-1000 ease-out",
								themeColorClass,
							)}
						/>
					</svg>
				</div>

				<div className="flex flex-1 flex-col justify-center gap-1">
					<div className="flex items-center justify-between">
						<Typography
							variant="h3"
							className="font-bold text-[15px] leading-none"
						>
							{name}
						</Typography>
						<Typography
							variant="small"
							className={cn("font-extrabold text-sm", themeColorClass)}
						>
							{percentage.toFixed(0)}%
						</Typography>
					</div>

					<Typography variant="p" className="font-medium text-xs">
						<Typography
							variant="small"
							className="font-semibold text-foreground"
						>
							{formatCurrency(amountSpent)}
						</Typography>{" "}
						/ {formatCurrency(budget)}
					</Typography>

					<div className="mt-1 flex items-center justify-between border-border/30 border-t pt-1.5">
						<Typography
							variant="small"
							className="font-bold text-[10px] uppercase tracking-wider"
						>
							{t("remaining_label")}
						</Typography>
						<Typography
							variant="small"
							className={cn(
								"font-bold font-mono text-sm",
								remaining >= 0
									? "text-emerald-600 dark:text-emerald-500"
									: "text-destructive",
							)}
						>
							{remaining > 0 ? "+" : ""}
							{formatCurrency(remaining)}
						</Typography>
					</div>
				</div>
			</div>
		</Link>
	)
}
