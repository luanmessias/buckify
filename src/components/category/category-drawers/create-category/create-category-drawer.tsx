"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Tag } from "lucide-react"
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
import { IconPicker } from "@/components/ui/icon-picker"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

type CreateCategoryFormData = {
	name: string
	description: string
	budget: number
	color?: string
	icon?: string
}

interface CreateCategoryDrawerProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (category: CreateCategoryFormData) => Promise<void>
	isSubmitting?: boolean
}

const createFormSchema = (t: (key: string) => string) =>
	z.object({
		name: z.string().min(2, t("name_min_length")),
		description: z.string().min(2, t("description_min_length")),
		budget: z.coerce.number().min(0.01, t("budget_min")),
		color: z.string().optional(),
		icon: z.string().optional(),
	})

export const CreateCategoryDrawer = ({
	isOpen,
	onClose,
	onConfirm,
	isSubmitting = false,
}: CreateCategoryDrawerProps) => {
	const t = useTranslations("Categories")
	const tCategory = useTranslations("Category")
	const tCommon = useTranslations("Common")

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose()
		}
	}

	const formSchema = createFormSchema(t)

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			budget: 0,
			color: "",
			icon: "",
		},
	})

	async function onSubmit(values: CreateCategoryFormData) {
		await onConfirm(values)
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<Tag className="h-5 w-5 text-primary" />
						{t("new_category")}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{t("create_category_description")}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-hidden p-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("name")}</FormLabel>
											<FormControl>
												<Input placeholder={t("name_placeholder")} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="icon"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("icon")}</FormLabel>
											<FormControl>
												<IconPicker
													value={field.value || ""}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("description")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("description_placeholder")}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="budget"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-end justify-between">
											<FormLabel>{tCategory("monthly_budget")}</FormLabel>

											<div className="flex items-center gap-1 border-border/50 border-b transition-colors focus-within:border-primary">
												<span className="text-muted-foreground text-sm">
													{tCategory("currency_symbol")}
												</span>
												<FormControl>
													<input
														type="number"
														className="w-16 bg-transparent text-right font-bold font-mono text-lg focus:outline-none"
														placeholder={t("budget_placeholder")}
														{...field}
														value={(field.value as number) || 0}
														onChange={(e) => {
															const val =
																e.target.value === ""
																	? 0
																	: Number(e.target.value)
															field.onChange(val)
														}}
													/>
												</FormControl>
											</div>
										</div>

										<Slider
											defaultValue={[0]}
											value={[Number(field.value) || 0]}
											max={3000}
											step={10}
											onValueChange={(vals) => field.onChange(vals[0])}
											className="py-4"
										/>
										<p className="text-center text-[10px] text-muted-foreground/60">
											{tCategory("budget_hint_text", {
												defaultMessage:
													"Adjusting recalculates remaining balance",
											})}
										</p>
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
									t("add_category")
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
