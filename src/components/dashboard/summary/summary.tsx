"use client"

import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
import { MonthSelector } from "@/components/month-selector/month-selector"
import { Typography } from "@/components/ui/typography"
import type { Category, Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

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
	const { theme } = useTheme()

	const lightModeClasses =
		"bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50 shadow-xl shadow-zinc-300/50"
	const darkModeClasses =
		"bg-gradient-to-br from-[#5D6F6E] via-[#636E70] to-[#A0D199] shadow-2xl shadow-black/50"

	const borderClasses = theme === "dark" ? darkModeClasses : lightModeClasses

	return (
		<section className="px-4">
			<AnimatedWrapper
				className={cn(
					"relative overflow-hidden rounded-xl p-px",
					borderClasses,
				)}
			>
				<div className="relative z-10 h-full rounded-xl bg-card p-6 text-card-foreground">
					<div className="pointer-events-none absolute top-0 right-0 h-70 w-70 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />

					<Typography
						variant="h2"
						className="mb-2 border-0 text-muted-foreground text-xs uppercase tracking-wider"
					>
						{t("month_summary")}
					</Typography>

					<MonthSelector className="mb-4" />

					<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
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
											innerRadius={85}
											outerRadius={100}
											paddingAngle={5}
											cornerRadius={4}
											stroke="none"
										>
											{chartData.map((entry) => (
												<Cell
													key={entry.id}
													fill={entry.color || "#333"}
													className="stroke-2 stroke-card"
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
								<div className="fade-in flex h-full w-full animate-in items-center justify-center rounded-full border-15 border-muted/10 duration-500" />
							)}

							<div className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center">
								<Typography
									variant="muted"
									className="mb-1 font-medium text-[10px] uppercase tracking-widest"
								>
									{t("total_spent")}
								</Typography>
								<Typography
									variant="h1"
									className="font-bold text-2xl text-foreground drop-shadow-lg"
								>
									{formatCurrency(totalSpent)}
								</Typography>
							</div>
						</div>

						<div className="w-full flex-1 space-y-6">
							<div className="flex justify-between md:justify-end">
								<div className="text-left">
									<Typography
										variant="muted"
										className="mb-1 text-xs uppercase tracking-wider"
									>
										{t("budget")}
									</Typography>
									<Typography
										variant="p"
										className="font-bold text-foreground text-xl"
									>
										{formatCurrency(totalBudget)}
									</Typography>
								</div>
								<div className="text-right">
									<Typography
										variant="muted"
										className="mb-1 text-xs uppercase tracking-wider"
									>
										{t("remaining")}
									</Typography>
									<Typography
										variant="p"
										className={cn(
											"font-bold text-xl drop-shadow-sm",
											remaining < 0 ? "text-destructive" : "text-primary",
										)}
									>
										{formatCurrency(remaining)}
									</Typography>
								</div>
							</div>

							<div className="hidden gap-10 space-y-3 border-border/40 border-t pt-6 md:block">
								{chartData.slice(0, 3).map((cat) => (
									<div
										key={cat.id}
										className="group flex h-4 items-center justify-between text-sm"
									>
										<div className="flex items-center gap-3">
											<div
												className="h-2.5 w-2.5 rounded-full ring-2 ring-transparent transition-all group-hover:scale-110"
												style={{
													backgroundColor: cat.color,
													boxShadow: `0 0 10px ${cat.color}40`,
												}}
											/>
											<Typography
												variant="muted"
												className="transition-colors group-hover:text-foreground"
											>
												{cat.name}
											</Typography>
										</div>
										<Typography
											variant="p"
											className="font-medium text-foreground tracking-wide"
										>
											{formatCurrency(cat.value)}
										</Typography>
									</div>
								))}
								{chartData.length > 3 && (
									<Typography
										variant="muted"
										className="pt-2 text-center text-xs italic"
									>
										{t("hidden_categories", { count: chartData.length - 3 })}
									</Typography>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="pointer-events-none absolute -inset-1 z-0 bg-primary/20 opacity-10 blur-3xl" />
			</AnimatedWrapper>
		</section>
	)
}
