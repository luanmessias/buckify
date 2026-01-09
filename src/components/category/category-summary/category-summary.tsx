"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
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
		<AnimatedWrapper className="relative rounded-xl p-px overflow-hidden bg-linear-to-br from-[#5D6F6E] via-[#636E70] to-[#A0D199] shadow-2xl shadow-black/50">
			<div className="bg-card text-card-foreground rounded-xl p-6 h-full relative z-10">
				<div className="absolute right-0 top-0 w-70 h-70 bg-linear-to-br from-primary/10 to-transparent opacity-30 rounded-bl-full pointer-events-none" />

				<div className="flex flex-col items-center justify-center relative z-10">
					<Typography variant="h3" className="mb-1 font-bold tracking-tight">
						{category.name}
					</Typography>

					<div className="relative h-48 w-full max-w-75 mt-4">
						<ResponsiveContainer width="100%" height="100%">
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

						<div className="absolute inset-0 top-10 flex flex-col items-center justify-center pointer-events-none">
							<Typography
								variant="h1"
								className="text-4xl font-extrabold drop-shadow-md"
							>
								{Math.round(percentage)}%
							</Typography>
							<Typography
								variant="muted"
								className="text-xs uppercase tracking-widest mt-1"
							>
								{t("used_of_budget")}
							</Typography>
						</div>
					</div>

					<div className="w-full flex justify-between items-center mt-2 border-t border-border/40 pt-4">
						<div className="text-left">
							<Typography
								variant="muted"
								className="text-[10px] uppercase font-bold text-muted-foreground/70"
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
								className="text-[10px] uppercase font-bold text-muted-foreground/70"
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
