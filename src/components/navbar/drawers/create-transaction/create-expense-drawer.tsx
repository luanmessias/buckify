"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
			categoryId: "casa",
			date: new Date().toISOString().split("T")[0],
		},
	})

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
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("amount")}</FormLabel>
										<FormControl>
											<div className="relative">
												<span className="absolute top-4 left-3 font-bold text-muted-foreground">
													{t("currency_symbol")}
												</span>
												<Input
													type="number"
													step="0.01"
													placeholder={t("amount_placeholder")}
													className="h-14 pl-8 font-bold text-2xl"
													{...field}
													value={(field.value as number) || ""}
													onChange={(e) => {
														const val =
															e.target.value === ""
																? undefined
																: Number(e.target.value)
														field.onChange(val)
													}}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("description")}</FormLabel>
										<FormControl>
											<Input placeholder={t("example_dinner")} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("category")}</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
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

								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("date")}</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														className="block w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
														type="date"
														{...field}
													/>
													<CalendarIcon className="pointer-events-none absolute top-2.5 right-3 h-4 w-4 opacity-50" />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

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
