"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MoneyInput } from "@/components/common/money-input/money-input"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAppSelector } from "@/lib/hooks"

type CreateExpenseFormData = {
	description: string
	amount: number
	categoryId: string
	date: string
}

interface CreateExpenseDrawerProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (transaction: CreateExpenseFormData) => Promise<void>
	isSubmitting?: boolean
	defaultCategoryId?: string
	forceCategory?: boolean
}

const createFormSchema = (t: (key: string) => string) =>
	z.object({
		description: z.string().min(2, t("description_min_length")),
		amount: z.coerce.number().min(0.01, t("amount_min")),
		categoryId: z.string().min(1, t("select_category")),
		date: z.string().min(1, t("date_required")),
	})

export const CreateExpenseDrawer = ({
	isOpen,
	onClose,
	onConfirm,
	isSubmitting = false,
	defaultCategoryId,
	forceCategory = false,
}: CreateExpenseDrawerProps) => {
	const t = useTranslations("Transactions")
	const tCommon = useTranslations("Common")
	const categories = useAppSelector((state) => state.categories.items)

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose()
		}
	}

	const formSchema = createFormSchema(t)

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: "",
			amount: 0,
			categoryId: defaultCategoryId || "casa",
			date: new Date().toISOString().split("T")[0],
		},
	})

	useEffect(() => {
		if (isOpen && defaultCategoryId) {
			form.setValue("categoryId", defaultCategoryId)
		}
	}, [isOpen, defaultCategoryId, form])

	async function onSubmit(values: CreateExpenseFormData) {
		await onConfirm(values)
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-70 w-70 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5 text-primary" />
						{t("new_expense")}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{t("add_expense")}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-hidden p-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("description")}</FormLabel>
											<FormControl>
												<Input
													placeholder={t("example_dinner")}
													className="h-10 border-border/50 bg-muted/20 transition-all focus:bg-background"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("category")}</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={forceCategory}
											>
												<FormControl>
													<SelectTrigger className="h-10 border-border/50 bg-muted/20 transition-all focus:bg-background">
														<SelectValue placeholder={t("select")} />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{categories.map((cat) => (
														<SelectItem key={cat.id} value={cat.id}>
															{cat.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("date")}</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													className="block h-10 w-full border-border/50 bg-muted/20 transition-all focus:bg-background [&::-webkit-calendar-picker-indicator]:opacity-0"
													type="date"
													{...field}
												/>
												<CalendarIcon className="pointer-events-none absolute top-3 right-3 h-4 w-4 opacity-50" />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-end justify-between">
											<FormLabel>{t("amount")}</FormLabel>

											<div className="flex items-center gap-1 border-border/50 border-b transition-colors focus-within:border-primary">
												<span className="text-muted-foreground text-sm">
													{t("currency_symbol")}
												</span>
												<FormControl>
													<MoneyInput
														className="w-24 text-lg"
														placeholder={t("amount_placeholder")}
														value={Number(field.value) || 0}
														onValueChange={field.onChange}
													/>
												</FormControl>
											</div>
										</div>

										<Slider
											defaultValue={[0]}
											value={[Number(field.value) || 0]}
											max={3000}
											step={0.1}
											onValueChange={(vals) => field.onChange(vals[0])}
											className="py-4"
										/>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="h-11 w-full"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
										{t("saving")}
									</>
								) : (
									t("add_expense")
								)}
							</Button>
						</form>
					</Form>
				</div>

				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{tCommon("close")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
