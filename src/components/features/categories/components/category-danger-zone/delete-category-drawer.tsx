import { gql } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/lib/types"

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!, $householdId: String!, $transferToCategoryId: String) {
    deleteCategory(id: $id, householdId: $householdId, transferToCategoryId: $transferToCategoryId) {
      success
      message
    }
  }
`

const GET_CATEGORIES = gql`
  query GetCategoriesForDelete($householdId: String!) {
    getCategories(householdId: $householdId) {
      id
      name
    }
  }
`

interface DeleteCategoryDrawerProps {
	isOpen: boolean
	onClose: () => void
	category: Category
	householdId: string
}

const formSchema = z.object({
	confirmation: z.string().min(1, "Please confirm by typing the category name"),
	actionType: z.enum(["delete", "move"]),
	transferToCategoryId: z.string().optional(),
})

interface GetCategoriesResponse {
	getCategories: Category[]
}

interface DeleteCategoryResponse {
	deleteCategory: {
		success: boolean
		message: string
	}
}

export const DeleteCategoryDrawer = ({
	isOpen,
	onClose,
	category,
	householdId,
}: DeleteCategoryDrawerProps) => {
	const t = useTranslations("Category")
	const router = useRouter()
	const [deleteCategory, { loading: deleting }] =
		useMutation<DeleteCategoryResponse>(DELETE_CATEGORY_MUTATION)

	const { data: categoriesData, loading: loadingCategories } =
		useQuery<GetCategoriesResponse>(GET_CATEGORIES, {
			variables: { householdId },
			skip: !isOpen,
		})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			confirmation: "",
			actionType: "delete",
		},
	})

	const actionType = form.watch("actionType")

	const otherCategories =
		categoriesData?.getCategories.filter(
			(c: Category) => c.id !== category.id,
		) || []

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (values.confirmation !== category.name) {
			form.setError("confirmation", {
				message: t("category_name_mismatch"),
			})
			return
		}

		if (values.actionType === "move" && !values.transferToCategoryId) {
			form.setError("transferToCategoryId", {
				message: t("select_move_category"),
			})
			return
		}

		try {
			const res = await deleteCategory({
				variables: {
					id: category.id,
					householdId,
					transferToCategoryId:
						values.actionType === "move" ? values.transferToCategoryId : null,
				},
				refetchQueries: ["GetDashboardData"],
			})

			if (res.data?.deleteCategory?.success) {
				toast.success(t("category_deleted_success"))
				onClose()
				router.push("/")
			} else {
				toast.error(res.data?.deleteCategory?.message || "Something went wrong")
			}
		} catch (error) {
			console.error("Delete error:", error)
			toast.error(t("error_deleting"))
		}
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose()
			form.reset()
		}
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
						{t("delete_category_confirmation", { name: category.name })}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{t("delete_category_warning")}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto p-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6 px-4"
						>
							<FormField
								control={form.control}
								name="actionType"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel>{t("what_to_do_transactions")}</FormLabel>
										<FormControl>
											<div className="flex flex-col space-y-3 rounded-md border p-4">
												<div className="flex items-center space-x-3">
													<input
														type="radio"
														id="action-delete"
														value="delete"
														checked={field.value === "delete"}
														onChange={(e) => field.onChange(e.target.value)}
														className="h-4 w-4 border-gray-300 text-destructive focus:ring-destructive"
													/>
													<Label
														htmlFor="action-delete"
														className="cursor-pointer font-normal"
													>
														{t("delete_all_transactions")}
													</Label>
												</div>
												<div className="flex items-center space-x-3">
													<input
														type="radio"
														id="action-move"
														value="move"
														checked={field.value === "move"}
														onChange={(e) => field.onChange(e.target.value)}
														className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
													/>
													<Label
														htmlFor="action-move"
														className="cursor-pointer font-normal"
													>
														{t("move_transactions")}
													</Label>
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{actionType === "move" && (
								<FormField
									control={form.control}
									name="transferToCategoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("move_to")}</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={
																loadingCategories
																	? t("loading")
																	: t("select_category_placeholder")
															}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{otherCategories.map((c: Category) => (
														<SelectItem key={c.id} value={c.id}>
															{c.name}
														</SelectItem>
													))}
													{otherCategories.length === 0 &&
														!loadingCategories && (
															<div className="p-2 text-center text-muted-foreground text-sm">
																{t("no_categories_found")}
															</div>
														)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="confirmation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t.rich("type_to_confirm", {
												name: category.name,
												strong: (chunks: React.ReactNode) => (
													<strong>{chunks}</strong>
												),
											})}
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder={category.name} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								variant="destructive"
								className="w-full"
								disabled={
									deleting || form.watch("confirmation") !== category.name
								}
							>
								{deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{t("delete_category")}
							</Button>
						</form>
					</Form>
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
