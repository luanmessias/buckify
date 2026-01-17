"use client"

import { useMemo } from "react"
import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
import type { Category, Transaction } from "@/lib/types"
import { CategoryCard } from "../category-card/category-card"

interface CategoryListProps {
	transactions: Transaction[]
	categories: Category[]
}

export const CategoryList = ({
	transactions,
	categories,
}: CategoryListProps) => {
	const data = useMemo(() => {
		return categories
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
	}, [transactions, categories])

	return (
		<div className="grid grid-cols-1 gap-4 px-4 pb-8 md:grid-cols-2">
			{data.map((category, index) => (
				<AnimatedWrapper key={category.id} delay={index * 0.2}>
					<CategoryCard
						id={category.id}
						name={category.name}
						slug={category.slug}
						icon={category.icon || "MoreHorizontal"}
						color="var(--color-hades-300)"
						amountSpent={category.value}
						budget={category.budget}
					/>
				</AnimatedWrapper>
			))}
		</div>
	)
}
