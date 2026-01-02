"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Category, Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CategoryCard } from "../category-summary/category-card"

interface SummaryProps {
	transactions: Transaction[]
	categories: Category[]
}

const RADIANT_PALETTE = ["#A0D199", "#81B8B3", "#A7B6A3", "#636E70", "#5D6F6E"]

const getRadiantColor = (index: number) => {
	return RADIANT_PALETTE[index % RADIANT_PALETTE.length]
}

export const Summary = ({ transactions, categories }: SummaryProps) => {
	const t = useTranslations("Transactions")

	const { totalSpent, totalBudget, remaining, chartData } = useMemo(() => {
		const totalSpentCalc = transactions.reduce(
			(acc, item) => acc + item.amount,
			0,
		)
		const totalBudgetCalc = categories.reduce(
			(acc, item) => acc + item.budget,
			0,
		)
		const remainingCalc = totalBudgetCalc - totalSpentCalc

		const data = categories
			.map((category) => {
				const amount = transactions
					.filter((t) => t.categoryId === category.id)
					.reduce((acc, t) => acc + t.amount, 0)

				return {
					...category,
					value: amount,
				}
			})
			.filter((item) => item.value > 0)
			.sort((a, b) => b.value - a.value)
			.map((item, index) => ({
				...item,
				color: getRadiantColor(index),
			}))

		return {
			totalSpent: totalSpentCalc,
			totalBudget: totalBudgetCalc,
			remaining: remainingCalc,
			chartData: data,
		}
	}, [transactions, categories])

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("pt", {
			style: "currency",
			currency: "EUR",
		}).format(value)

	const hasData = totalSpent > 0

	return (
		<section className="p-4">
			<div className="relative rounded-2xl p-px overflow-hidden bg-linear-to-br from-[#5D6F6E] via-[#636E70] to-[#A0D199] shadow-2xl shadow-black/50">
				<div className="bg-card text-card-foreground rounded-2xl p-6 h-full relative z-10">
					<div className="absolute right-0 top-0 w-70 h-70 bg-linear-to-br from-primary/10 to-transparent opacity-30 rounded-bl-full pointer-events-none" />

					<h2 className="font-semibold mb-6 text-muted-foreground tracking-wider uppercase text-xs">
						{t("month_summary")}
					</h2>

					<div className="flex flex-col md:flex-row items-center justify-between gap-8">
						<div className="relative h-60 w-60 shrink-0">
							{hasData ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={chartData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											innerRadius={65}
											outerRadius={80}
											paddingAngle={5}
											cornerRadius={4}
											stroke="none"
										>
											{chartData.map((entry) => (
												<Cell
													key={entry.id}
													fill={entry.color || "#333"}
													className="stroke-card stroke-2"
												/>
											))}
										</Pie>
										<Tooltip
											cursor={false}
											formatter={(value: number | undefined) =>
												formatCurrency(value ?? 0)
											}
											contentStyle={{
												backgroundColor: "#1a1d21",
												borderColor: "#2e3238",
												color: "#e5e5e5",
												borderRadius: "8px",
												boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
												fontSize: "0.875rem",
											}}
											itemStyle={{ color: "#e5e5e5" }}
										/>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="w-full h-full rounded-full border-15 border-muted/10 flex items-center justify-center animate-in fade-in duration-500" />
							)}

							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
								<span className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mb-1">
									{t("total_spent")}
								</span>
								<span className="text-2xl font-bold text-foreground drop-shadow-lg">
									{formatCurrency(totalSpent)}
								</span>
							</div>
						</div>

						<div className="flex-1 w-full space-y-6">
							<div className="flex justify-between md:justify-end gap-10 border-b border-border/40 pb-6">
								<div className="text-right">
									<p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
										{t("budget")}
									</p>
									<p className="font-bold text-xl text-foreground">
										{formatCurrency(totalBudget)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
										{t("remaining")}
									</p>
									<p
										className={cn(
											"font-bold text-xl drop-shadow-sm",
											remaining < 0 ? "text-destructive" : "text-primary",
										)}
									>
										{formatCurrency(remaining)}
									</p>
								</div>
							</div>

							<div className="space-y-3">
								{chartData.slice(0, 3).map((cat) => (
									<div
										key={cat.id}
										className="flex items-center justify-between text-sm group"
									>
										<div className="flex items-center gap-3">
											<div
												className="w-2.5 h-2.5 rounded-full ring-2 ring-transparent transition-all group-hover:scale-110"
												style={{
													backgroundColor: cat.color,
													boxShadow: `0 0 10px ${cat.color}40`,
												}}
											/>
											<span className="text-muted-foreground group-hover:text-foreground transition-colors">
												{cat.name}
											</span>
										</div>
										<span className="font-medium text-foreground tracking-wide">
											{formatCurrency(cat.value)}
										</span>
									</div>
								))}

								{chartData.length > 3 && (
									<p className="text-xs text-center text-muted-foreground/50 pt-2 italic">
										{t("hidden_categories", { count: chartData.length - 3 })}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="absolute -inset-1 bg-primary/20 blur-3xl opacity-10 pointer-events-none z-0" />
			</div>

			<div className="my-8 h-px bg-linear-to-r from-transparent via-border to-transparent" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{chartData.map((category) => (
					<CategoryCard
						key={category.id}
						name={category.name}
						icon={category.icon || "MoreHorizontal"}
						color="var(--color-hades-300)"
						amountSpent={category.value}
						budget={category.budget}
					/>
				))}
			</div>
		</section>
	)
}
