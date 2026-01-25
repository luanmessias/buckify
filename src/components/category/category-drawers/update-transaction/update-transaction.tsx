"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { Save, Wallet } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/ui/money-input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Category, Transaction } from "@/lib/types"

interface TransactionInput {
	description: string
	amount: number
	categoryId: string
	date: string
}

interface UpdateTransactionDrawerProps {
	isOpen: boolean
	onClose: () => void
	transaction: Transaction | null
	onUpdate: (id: string, data: TransactionInput) => Promise<void>
	isSubmitting?: boolean
	householdId: string
}

interface GetCategories {
	getCategories: Category[]
}

const GET_CATEGORIES_DATA = gql`
	query GetCategories($householdId: String!) {
		getCategories(householdId: $householdId) {
			id
			name
			slug
			budget
			color
			icon
		}
	}
`

export const UpdateTransactionDrawer = ({
	isOpen,
	onClose,
	transaction,
	onUpdate,
	isSubmitting = false,
	householdId,
}: UpdateTransactionDrawerProps) => {
	const t = useTranslations("Transactions")

	const [description, setDescription] = useState(transaction?.description || "")
	const [amount, setAmount] = useState(transaction?.amount || 0)
	const [categoryId, setCategoryId] = useState(transaction?.categoryId || "")

	const { data } = useSuspenseQuery<GetCategories>(GET_CATEGORIES_DATA, {
		variables: {
			householdId,
		},
	})

	useEffect(() => {
		if (transaction) {
			setDescription(transaction.description)
			setAmount(transaction.amount)
			setCategoryId(transaction.categoryId)
		}
	}, [transaction])

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose()
	}

	const handleSliderChange = (value: number[]) => {
		setAmount(value[0])
	}

	const handleSave = async () => {
		if (!transaction) return
		await onUpdate(transaction.id, {
			description,
			amount,
			categoryId,
			date: transaction.date,
		})
	}

	const hasChanges = transaction
		? description !== transaction.description ||
			amount !== transaction.amount ||
			categoryId !== transaction.categoryId
		: false

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5 text-primary" />
						{t("edit_transaction")}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{t("edit_transaction_description")}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 space-y-8 overflow-hidden p-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="description">
								{t("edit_transaction_field_description")}
							</Label>
							<Input
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="h-10 border-border/50 bg-muted/20 transition-all focus:bg-background"
								placeholder={t("edit_transaction_field_description")}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="categories">
								{t("edit_transaction_categories_select")}
							</Label>
							<Select
								value={categoryId}
								onValueChange={setCategoryId}
								disabled={isSubmitting}
							>
								<SelectTrigger>
									<SelectValue placeholder={t("select")} />
								</SelectTrigger>
								<SelectContent>
									{data.getCategories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-end justify-between">
							<Label htmlFor="amount">{t("amount")}</Label>

							<div className="flex items-center gap-1 border-border/50 border-b transition-colors focus-within:border-primary">
								<span className="text-muted-foreground text-sm">
									{t("currency_symbol")}
								</span>
								<MoneyInput
									value={amount}
									onValueChange={setAmount}
									className="w-24 text-lg"
									disabled={isSubmitting}
								/>
							</div>
						</div>

						<Slider
							defaultValue={[amount]}
							value={[amount]}
							max={3000}
							step={0.1}
							onValueChange={handleSliderChange}
							className="py-4"
							disabled={isSubmitting}
						/>
					</div>

					<Button
						onClick={handleSave}
						disabled={!hasChanges || isSubmitting}
						className="h-11 w-full gap-2 font-semibold text-base shadow-lg shadow-primary/20"
					>
						<Save className="h-4 w-4" />
						{t("save_changes")}
					</Button>
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
