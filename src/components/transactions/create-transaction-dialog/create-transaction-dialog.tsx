"use client"

import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
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
import { cn } from "@/lib/utils"

const createFormSchema = (t: (key: string) => string) =>
	z.object({
		description: z.string().min(2, t("description_min_length")),
		amount: z.coerce.number().min(0.01, t("amount_min")),
		categoryId: z.string().min(1, t("select_category")),
		date: z.string().min(1, t("date_required")),
	})

const CREATE_TRANSACTION = gql`
   mutation CreateTransaction($data: CreateTransactionInput!) {
     CreateTransaction(data: $data) {
       id
       description
       amount
     }
   }
 `

export function CreateTransactionDialog() {
	const t = useTranslations("Transactions")
	const tCommon = useTranslations("Common")
	const categories = useAppSelector((state) => state.categories.items)

	const [open, setOpen] = useState(false)

	const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
		refetchQueries: ["GetDashboardTransactions"],
		onCompleted: () => {
			toast.success(t("expense_added_success"))
			setOpen(false)
			form.reset()
		},
	})

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

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createTransaction({
			variables: {
				data: {
					...values,
					type: "expense",
				},
			},
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className={cn(
						"fixed -top-4 left-1/2 -translate-x-1/2",
						"rounded-full shadow-xl bg-primary border-3 border-hades-950",
						"cursor-pointer w-14 h-14",
						"group relative flex items-center justify-center",
						"rounded-full bg-primary border-[3px] border-hades-950",
						"shadow-xl transition-transform hover:scale-110 active:scale-95",
					)}
				>
					<div
						className={cn(
							"absolute inset-0 -z-10 rounded-full",
							"bg-linear-to-tr from-(--color-hades-500) to-cyan-400",
							"opacity-0 blur-none transition-all duration-500",
							"group-hover:opacity-50 group-hover:blur-sm group-hover:scale-125",
						)}
					/>
					<Plus className="h-full w-full text-hades-950 scale-200" />
				</Button>
			</DialogTrigger>

			<DialogContent
				className="sm:max-w-106.25"
				closeAriaLabel={tCommon("close")}
			>
				<DialogHeader>
					<DialogTitle>{t("new_expense")}</DialogTitle>
					<DialogDescription className="sr-only">
						{t("new_expense")}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 pt-4"
					>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("amount")}</FormLabel>
									<FormControl>
										<div className="relative">
											<span className="absolute left-3 top-4 text-muted-foreground font-bold">
												{t("currency_symbol")}
											</span>
											<Input
												type="number"
												step="0.01"
												placeholder={t("amount_placeholder")}
												className="pl-8 text-2xl font-bold h-14"
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
										<Select onValueChange={field.onChange} value={field.value}>
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
												<CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-11 mt-2"
							disabled={loading}
						>
							{loading ? (
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
			</DialogContent>
		</Dialog>
	)
}
