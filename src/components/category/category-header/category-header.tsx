"use client"

import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { ArrowLeft, Cog } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
import { MonthSelector } from "@/components/month-selector/month-selector"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
import { UpdateCategoryDrawer } from "./drawers/update-category/update-category"

interface UpdateCategoryResponse {
	updateCategory: {
		success: boolean
		message?: string
	}
}

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $householdId: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, householdId: $householdId, input: $input) {
      success
      message
    }
  }
`

interface CategoryHeaderProps {
	category: Category
	householdId: string
}

export const CategoryHeader = ({
	category,
	householdId,
}: CategoryHeaderProps) => {
	const t = useTranslations("Category")
	const searchParams = useSearchParams()
	const [isOpen, setIsOpen] = useState(false)

	const [updateCategory, { loading: isUpdating }] = useMutation(
		UPDATE_CATEGORY,
		{
			refetchQueries: ["GetCategoryData"],
			awaitRefetchQueries: true,
		},
	)

	const handleUpdate = async (
		id: string,
		data: {
			name: string
			budget: number
			icon: string
			description?: string
			color?: string
		},
	) => {
		try {
			const result = await updateCategory({
				variables: {
					id,
					householdId,
					input: data,
				},
			})

			if ((result.data as UpdateCategoryResponse)?.updateCategory?.success) {
				toast.success(t("category_updated"))
				setIsOpen(false)
			} else {
				toast.error(t("error_updating"))
			}
		} catch {
			toast.error(t("error_updating"))
		}
	}

	const currentMonth = searchParams.get("month")
	const backUrl = currentMonth ? `/?month=${currentMonth}` : "/"

	return (
		<AnimatedWrapper className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3">
			<div className="flex items-center justify-between max-w-7xl mx-auto">
				<Link href={backUrl} prefetch aria-label={t("back")}>
					<ArrowLeft className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
				</Link>

				<div className="flex-1 flex justify-center">
					<MonthSelector className="bg-transparent border-transparent shadow-none hover:bg-muted/20 w-auto" />
				</div>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsOpen(true)}
					aria-label={t("edit_category")}
					className="[&_svg]:size-6 hover:bg-transparent"
				>
					<Cog className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
				</Button>

				<UpdateCategoryDrawer
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					category={category}
					onUpdate={handleUpdate}
					isSubmitting={isUpdating}
				/>
			</div>
		</AnimatedWrapper>
	)
}
