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

const CATEGORIES = (t: (key: string) => string) => [
	{ id: "casa", label: t("categories.casa") },
	{ id: "mercado", label: t("categories.mercado") },
	{ id: "transporte", label: t("categories.transporte") },
	{ id: "restaurantes", label: t("categories.restaurantes") },
	{ id: "saude", label: t("categories.saude") },
	{ id: "outros", label: t("categories.outros") },
]

export function CreateTransactionDialog() {
	const t = useTranslations("Transactions")

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
					className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer"
					size="icon"
				>
					<Plus className="h-6 w-6 text-zinc-800" />
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("new_expense")}</DialogTitle>
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
												{CATEGORIES(t).map((cat) => (
													<SelectItem key={cat.id} value={cat.id}>
														{cat.label}
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
