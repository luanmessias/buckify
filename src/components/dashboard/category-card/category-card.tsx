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
	color,
	amountSpent,
	budget,
}: CategoryCardProps) => {
	const t = useTranslations("Transactions")
	const searchParams = useSearchParams()

	const queryString = searchParams.toString()
	const queryPrefix = queryString ? "?" : ""

	const percentage = Math.min((amountSpent / budget) * 100, 100)
	const remaining = budget - amountSpent
	const isOverBudget = remaining < 0
	const radiantGradient =
		"linear-gradient(to left, #5D6F6E, #636E70, #A7B6A3, #81B8B3, #A0D199)"
	const errorGradient =
		"linear-gradient(to left, #450a0a, #7f1d1d, #b91c1c, #ef4444)"

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(val)

	return (
		<Link href={`/category/${slug}${queryPrefix}${queryString}`}>
			<div className="bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors group relative overflow-hidden cursor-pointer">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-0 rounded-lg" style={{ color: color }}>
							<Icon name={icon} className="w-6 h-6" />
						</div>
						<div>
							<h3 className="font-semibold text-sm text-foreground">{name}</h3>
							<Typography variant="muted" className="text-xs">
								{formatCurrency(amountSpent)} {t("spent")} /{" "}
								{formatCurrency(budget)} {t("available")}
							</Typography>
						</div>
					</div>

					<Typography
						as="span"
						className={cn(
							"text-sm font-bold",
							isOverBudget ? "text-red-400" : "text-hades-300",
						)}
					>
						{percentage.toFixed(0)}%
					</Typography>
				</div>

				<div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
					<div
						className="h-full rounded-full transition-all duration-500 ease-out"
						style={{
							width: `${percentage}%`,
							background: isOverBudget ? errorGradient : radiantGradient,
						}}
					/>
				</div>

				<div className="flex justify-between items-center text-xs mt-1">
					<span className="text-muted-foreground">{t("remaining_label")}</span>
					<span
						className={cn(
							"font-medium",
							isOverBudget ? "text-red-400" : "text-hades-300",
						)}
					>
						{formatCurrency(remaining)}
					</span>
				</div>
			</div>
		</Link>
	)
}
