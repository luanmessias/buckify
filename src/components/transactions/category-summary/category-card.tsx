import { useTranslations } from "next-intl"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
	name: string
	icon: string
	color: string
	amountSpent: number
	budget: number
}

export const CategoryCard = ({
	name,
	icon,
	color,
	amountSpent,
	budget,
}: CategoryCardProps) => {
	const t = useTranslations("Transactions")

	const percentage = Math.min((amountSpent / budget) * 100, 100)
	const remaining = budget - amountSpent
	const isOverBudget = remaining < 0

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(val)

	return (
		<div className="bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col gap-3 hover:bg-card/80 transition-colors group relative overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className="p-2 rounded-lg bg-black/20 ring-1 ring-inset ring-white/10"
						style={{ color: color }}
					>
						<Icon name={icon} className="w-5 h-5" />
					</div>
					<div>
						<h3 className="font-semibold text-sm text-foreground">{name}</h3>
						<p className="text-xs text-muted-foreground">
							{formatCurrency(amountSpent)} {t("spent")} /{" "}
							{formatCurrency(budget)} {t("available")}
						</p>
					</div>
				</div>

				<span
					className={cn(
						"text-sm font-bold",
						isOverBudget ? "text-red-500" : "text-emerald-500",
					)}
				>
					{percentage.toFixed(0)}%
				</span>
			</div>

			<div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{
						width: `${percentage}%`,
						backgroundColor: isOverBudget ? "#ef4444" : color,
					}}
				/>
			</div>

			<div className="flex justify-between items-center text-xs mt-1">
				<span className="text-muted-foreground">{t("remaining_label")}</span>
				<span
					className={cn(
						"font-medium",
						isOverBudget ? "text-red-400" : "text-emerald-400",
					)}
				>
					{formatCurrency(remaining)}
				</span>
			</div>
		</div>
	)
}
