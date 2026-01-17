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
			<div className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card/80">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="rounded-lg p-0" style={{ color: color }}>
							<Icon name={icon} className="h-6 w-6" />
						</div>
						<div>
							<h3 className="font-semibold text-foreground text-sm">{name}</h3>
							<Typography variant="muted" className="text-xs">
								{formatCurrency(amountSpent)} {t("spent")} /{" "}
								{formatCurrency(budget)} {t("available")}
							</Typography>
						</div>
					</div>

					<Typography
						as="span"
						className={cn(
							"font-bold text-sm",
							isOverBudget ? "text-red-400" : "text-hades-300",
						)}
					>
						{percentage.toFixed(0)}%
					</Typography>
				</div>

				<div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
					<div
						className="h-full rounded-full transition-all duration-500 ease-out"
						style={{
							width: `${percentage}%`,
							background: isOverBudget ? errorGradient : radiantGradient,
						}}
					/>
				</div>

				<div className="mt-1 flex items-center justify-between text-xs">
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
