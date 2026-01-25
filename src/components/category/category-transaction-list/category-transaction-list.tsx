import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { SearchX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
import type { Transaction } from "@/lib/types"
import { UpdateTransactionDrawer } from "../category-drawers/update-transaction/update-transaction"
import { CategoryTransactionItem } from "../category-transaction-item/category-transaction-item"

interface CategoryTransactionListProps {
	transactions: Transaction[]
	householdId: string
}

interface UpdateTransactionResponse {
	updateTransaction: {
		success: boolean
		message?: string
		transaction?: Transaction
	}
}

const UPDATE_TRANSACTION = gql`
	mutation UpdateTransaction($id: String!, $householdId: String!, $input: UpdateTransactionInput!) {
		updateTransaction(id: $id, householdId: $householdId, input: $input) {
			success
			message
			transaction {
				id
				description
				amount
				categoryId
				date
			}
		}
	}
`

export const CategoryTransactionList = ({
	transactions,
	householdId,
}: CategoryTransactionListProps) => {
	const t = useTranslations("Category")

	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null)

	const [updateTransaction, { loading: isUpdating }] = useMutation(
		UPDATE_TRANSACTION,
		{
			refetchQueries: ["GetCategoryData"],
			awaitRefetchQueries: true,
			update(cache) {
				cache.modify({
					fields: {
						getTransactions(_existing, { INVALIDATE }) {
							return INVALIDATE
						},
					},
				})
			},
		},
	)

	const handleCloseTransactionDrawer = () => {
		setSelectedTransaction(null)
	}

	const handleUpdate = async (
		id: string,
		data: {
			description: string
			amount: number
			categoryId: string
			date: string
		},
	) => {
		try {
			const result = await updateTransaction({
				variables: {
					id,
					householdId,
					input: data,
				},
			})

			if (
				(result.data as UpdateTransactionResponse)?.updateTransaction?.success
			) {
				toast.success(t("transaction_updated"))
				handleCloseTransactionDrawer()
			} else {
				toast.error(t("error_updating"))
			}
		} catch {
			toast.error(t("error_updating"))
		}
	}

	if (transactions.length === 0) {
		return (
			<div className="fade-in zoom-in-95 flex animate-in flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground duration-300">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
					<SearchX className="h-6 w-6" />
				</div>
				<p className="font-medium text-sm">{t("no_transactions_found")}</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			{transactions.map((transaction, index) => (
				<AnimatedWrapper key={transaction.id} delay={index * 0.1}>
					<CategoryTransactionItem
						transaction={transaction}
						onEdit={() => setSelectedTransaction(transaction)}
					/>
				</AnimatedWrapper>
			))}

			<UpdateTransactionDrawer
				isOpen={!!selectedTransaction}
				onClose={handleCloseTransactionDrawer}
				transaction={selectedTransaction}
				onUpdate={handleUpdate}
				isSubmitting={isUpdating}
				householdId={householdId}
			/>
		</div>
	)
}
