"use client"

import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { ArrowLeft, Cog } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { MonthSelector } from "@/components/common/month-selector/month-selector"
import { UpdateCategoryDrawer } from "@/components/features/categories/components/update-category-drawer/update-category"
import { AnimatedWrapper } from "@/components/layout/wrappers/animated-wrapper/animated-wrapper"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface UpdateCategoryResponse {
	updateCategory: {
		success: boolean
		message?: string
	}
}

interface CategoryHeaderProps {
	category: Category
	householdId: string
}

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $householdId: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, householdId: $householdId, input: $input) {
      success
      message
    }
  }
`

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
		<>
			<AnimatedWrapper className="sticky top-0 z-40 bg-background/80 px-4 py-3 backdrop-blur-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link href={backUrl} prefetch aria-label={t("back")}>
						<ArrowLeft className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
					</Link>

					<div className="flex flex-1 justify-center">
						<MonthSelector className="w-auto border-transparent bg-transparent shadow-none hover:bg-muted/20" />
					</div>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsOpen(true)}
						aria-label={t("edit_category")}
						className="hover:bg-transparent [&_svg]:size-6"
					>
						<Cog className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
					</Button>
				</div>
			</AnimatedWrapper>

			<UpdateCategoryDrawer
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				category={category}
				onUpdate={handleUpdate}
				isSubmitting={isUpdating}
			/>
		</>
	)
}
