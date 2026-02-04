"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { AnimatedWrapper } from "@/components/layout/wrappers/animated-wrapper/animated-wrapper"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { Category } from "@/lib/types"

import { DeleteCategoryDrawer } from "./delete-category-drawer"

interface CategoryDangerZoneProps {
	category: Category
	householdId: string
}

export const CategoryDangerZone = ({
	category,
	householdId,
}: CategoryDangerZoneProps) => {
	const t = useTranslations("Category")
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<>
			<AnimatedWrapper delay={0.2}>
				<Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/10">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pt-6 pb-6">
						<div className="space-y-1">
							<CardTitle className="text-red-700 dark:text-red-400">
								{t("danger_zone")}
							</CardTitle>
							<CardDescription className="text-red-600/80 dark:text-red-400/80">
								{t("danger_zone_description")}
							</CardDescription>
						</div>
						<Button
							variant="destructive"
							onClick={() => setIsDialogOpen(true)}
							className="ml-4"
						>
							{t("delete_category")}
						</Button>
					</CardHeader>
				</Card>
			</AnimatedWrapper>

			<DeleteCategoryDrawer
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				category={category}
				householdId={householdId}
			/>
		</>
	)
}
