"use client"

import { AnimatedWrapper } from "@/components/layout/wrappers/animated-wrapper/animated-wrapper"
import type { Category } from "@/lib/types"
import { CategoryCard } from "../category-card/category-card"

export type CategoryWithData = Category & { value: number }

interface CategoryListProps {
	data: CategoryWithData[]
}

export const CategoryList = ({ data }: CategoryListProps) => {
	return (
		<div className="grid grid-cols-1 gap-4 px-4 pb-8 md:grid-cols-2">
			{data.map((category, index) => (
				<AnimatedWrapper key={category.id} delay={index * 0.05}>
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
