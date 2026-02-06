"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { AnimatedWrapper } from "@/components/layout/wrappers/animated-wrapper/animated-wrapper"
import { Typography } from "@/components/ui/typography"
import type { Category, Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CategorySummaryProps {
	category: Category
	transactions: Transaction[]
}

export const CategorySummary = ({
	category,
	transactions: rawTransactions,
}: CategorySummaryProps) => {
	const t = useTranslations("Category")

	const { totalSpent, percentage, remaining, chartData, fillUrl } =
		useMemo(() => {
			const spent = rawTransactions.reduce((acc, t) => acc + t.amount, 0)
			const budget = category.budget || 0
			const remain = budget - spent

			const percent = budget > 0 ? (spent / budget) * 100 : 0
			const cappedPercent = Math.min(percent, 100)

			const isOverBudget = percent >= 100
			const currentFillUrl = isOverBudget
				? "url(#errorGradient)"
				: "url(#radiantGradient)"

			const data = [
				{ name: "Spent", value: cappedPercent },
				{ name: "Remaining", value: 100 - cappedPercent },
			]

			return {
				totalSpent: spent,
				percentage: percent,
				remaining: remain,
				chartData: data,
				fillUrl: currentFillUrl,
			}
		}, [category, rawTransactions])

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("pt", {
			style: "currency",
			currency: "EUR",
		}).format(value)

	return (
		<AnimatedWrapper
			className={cn(
				"relative overflow-hidden rounded-xl bg-linear-to-br from-zinc-200 via-zinc-100 to-zinc-50 p-px shadow-xl shadow-zinc-300/50 dark:from-[#5D6F6E] dark:via-[#636E70] dark:to-[#A0D199] dark:shadow-2xl dark:shadow-black/50",
			)}
		>
			<div className="relative z-10 h-full rounded-xl bg-card p-6 text-card-foreground">
				<div className="pointer-events-none absolute top-0 right-0 h-70 w-70 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />

				<div className="relative z-10 flex flex-col items-center justify-center">
					<Typography variant="h3" className="mb-1 font-bold tracking-tight">
						{category.name}
					</Typography>

					<div className="relative mt-4 h-48 w-full max-w-75">
						<ResponsiveContainer
							width="100%"
							height="100%"
							minWidth={10}
							minHeight={10}
							debounce={1}
						>
							<PieChart>
								<defs>
									<linearGradient
										id="radiantGradient"
										x1="1"
										y1="0"
										x2="0"
										y2="0"
									>
										<stop offset="0%" stopColor="#5D6F6E" />
										<stop offset="20%" stopColor="#636E70" />
										<stop offset="40%" stopColor="#A7B6A3" />
										<stop offset="70%" stopColor="#81B8B3" />
										<stop offset="100%" stopColor="#A0D199" />
									</linearGradient>

									<linearGradient
										id="errorGradient"
										x1="1"
										y1="0"
										x2="0"
										y2="0"
									>
										<stop offset="0%" stopColor="#450a0a" />
										<stop offset="30%" stopColor="#7f1d1d" />
										<stop offset="60%" stopColor="#b91c1c" />
										<stop offset="100%" stopColor="#ef4444" />
									</linearGradient>
								</defs>

								<Pie
									data={[{ value: 100 }]}
									dataKey="value"
									cx="50%"
									cy="70%"
									startAngle={180}
									endAngle={0}
									innerRadius={80}
									outerRadius={100}
									fill="hsl(var(--muted))"
									opacity={0.2}
									stroke="none"
									paddingAngle={0}
								/>

								<Pie
									data={chartData}
									dataKey="value"
									cx="50%"
									cy="70%"
									startAngle={180}
									endAngle={0}
									innerRadius={80}
									outerRadius={100}
									stroke="none"
									cornerRadius={10}
									paddingAngle={0}
								>
									<Cell fill={fillUrl} />
									<Cell fill="transparent" />
								</Pie>
							</PieChart>
						</ResponsiveContainer>

						<div className="pointer-events-none absolute inset-0 top-10 flex flex-col items-center justify-center">
							<Typography
								variant="h1"
								className="font-extrabold text-4xl drop-shadow-md"
							>
								{Math.round(percentage)}%
							</Typography>
							<Typography
								variant="muted"
								className="mt-1 text-xs uppercase tracking-widest"
							>
								{t("used_of_budget")}
							</Typography>
						</div>
					</div>

					<div className="mt-2 flex w-full items-center justify-between border-border/40 border-t pt-4">
						<div className="text-left">
							<Typography
								variant="muted"
								className="font-bold text-[10px] text-muted-foreground/70 uppercase"
							>
								{t("total_spent")}
							</Typography>
							<Typography variant="p" className="font-semibold text-lg">
								{formatCurrency(totalSpent)}
							</Typography>
						</div>

						<div className="text-right">
							<Typography
								variant="muted"
								className="font-bold text-[10px] text-muted-foreground/70 uppercase"
							>
								{t("remaining")}
							</Typography>
							<Typography
								variant="p"
								className={cn(
									"font-semibold text-lg",
									remaining < 0 ? "text-destructive" : "text-primary",
								)}
							>
								{formatCurrency(remaining)}
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</AnimatedWrapper>
	)
}
