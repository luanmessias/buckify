"use client"

import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { Plus, ScanText, Tag, Wallet } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { CreateCategoryDrawer } from "@/components/features/categories/components/create-category-drawer/create-category-drawer"
import { CreateExpenseDrawer } from "@/components/features/transactions/components/create-transaction-drawer/create-expense-drawer"
import { ImportTransactionDrawer } from "@/components/features/transactions/components/import-transaction-drawer/import-transaction-drawer"
import { ActionPill } from "@/components/layout/bottom-nav/action-pill/action-pill"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { cn } from "@/lib/utils"

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($householdId: String!, $transaction: CreateTransactionInput!) {
    createTransaction(householdId: $householdId, transaction: $transaction) {
      success
      message
    }
  }
  `

const CREATE_CATEGORY = gql`
  mutation CreateCategory($householdId: String!, $category: CreateCategoryInput!) {
    createCategory(householdId: $householdId, category: $category) {
      success
      message
    }
  }
`

const CREATE_MANY_TRANSACTIONS = gql`
  mutation CreateManyTransactions($householdId: String!, $transactions: [CreateTransactionInput!]!) {
    createManyTransactions(householdId: $householdId, transactions: $transactions) {
      success
      message
    }
  }
  `

interface CreateManyTransactionsResult {
	createManyTransactions: {
		success: boolean
		message: string
	}
}

interface MutationResponse {
	success: boolean
	message: string
}

interface CreateTransactionResult {
	createTransaction: MutationResponse
}

interface TransactionDraft {
	date: string
	description: string
	amount: number
	categoryId: string
}

interface CreateTransactionInput {
	description: string
	amount: number
	categoryId: string
	date: string
}

interface CreateCategoryInput {
	name: string
	description: string
	budget: number
	color?: string
	icon?: string
}

interface CreateCategoryResult {
	createCategory: MutationResponse
}

export const AddNavigation = () => {
	const t = useTranslations("Transactions")
	const tNav = useTranslations("Navigation")
	const tCategories = useTranslations("Categories")
	const [isOpen, setIsOpen] = useState(false)
	const [showImportDrawer, setShowImportDrawer] = useState(false)

	const [showAddExpenseDrawer, setShowAddExpenseDrawer] = useState(false)
	const [showAddCategoryDrawer, setShowAddCategoryDrawer] = useState(false)

	const householdId = useAppSelector((state) => state.household.id)

	const [createTransaction, { loading: createLoading }] =
		useMutation<CreateTransactionResult>(CREATE_TRANSACTION, {
			refetchQueries: ["GetDashboardData"],
			awaitRefetchQueries: true,
		})

	const [createCategory, { loading: createCategoryLoading }] =
		useMutation<CreateCategoryResult>(CREATE_CATEGORY, {
			refetchQueries: ["GetCategories"],
			awaitRefetchQueries: true,
		})

	const [createManyTransactions, { loading: importLoading }] =
		useMutation<CreateManyTransactionsResult>(CREATE_MANY_TRANSACTIONS, {
			refetchQueries: ["GetDashboardData"],
			awaitRefetchQueries: true,
		})

	const toggleMenu = () => setIsOpen(!isOpen)

	const handleOpenImportDrawer = () => {
		setShowImportDrawer(true)
		setIsOpen(false)
	}

	const handleOpenAddCategoryDrawer = () => {
		setShowAddCategoryDrawer(true)
		setIsOpen(false)
	}

	const handleOpenAddExpenseDrawer = () => {
		setShowAddExpenseDrawer(true)
		setIsOpen(false)
	}

	const handleCreateCategoryConfirm = async (category: CreateCategoryInput) => {
		try {
			if (!householdId) {
				toast.error(t("session_error_reload"))
				return
			}

			const { data } = await createCategory({
				variables: {
					householdId,
					category,
				},
			})

			if (data?.createCategory?.success) {
				toast.success(tCategories("category_created"))
				setShowAddCategoryDrawer(false)
			} else {
				toast.error(
					t("error_saving", {
						message: data?.createCategory?.message || "",
					}),
				)
			}
		} catch (error) {
			console.error(error)
			toast.error(t("error_saving"))
		}
	}

	const handleCreateExpenseConfirm = async (
		transaction: CreateTransactionInput,
	) => {
		try {
			if (!householdId) {
				toast.error(t("session_error_reload"))
				return
			}

			const { data } = await createTransaction({
				variables: {
					householdId,
					transaction,
				},
			})

			if (data?.createTransaction?.success) {
				toast.success(t("expense_added"))
				setShowAddExpenseDrawer(false)
			} else {
				toast.error(
					t("error_saving", {
						message: data?.createTransaction?.message || "",
					}),
				)
			}
		} catch (error) {
			console.error(error)
			toast.error(t("error_saving_transactions"))
		}
	}

	const handleImportConfirm = async (transactions: TransactionDraft[]) => {
		try {
			if (!householdId) {
				toast.error(t("session_error_reload"))
				return
			}

			const cleanTransactions = transactions.map((t) => ({
				date: t.date,
				description: t.description,
				amount: Number(t.amount),
				categoryId: t.categoryId,
			}))

			const { data } = await createManyTransactions({
				variables: {
					householdId,
					transactions: cleanTransactions,
				},
			})

			if (data?.createManyTransactions?.success) {
				toast.success(data.createManyTransactions.message)
				setIsOpen(false)
				setShowImportDrawer(false)
			} else {
				toast.error(
					t("error_saving", {
						message: data?.createManyTransactions?.message || "",
					}),
				)
			}
		} catch (error) {
			console.error(error)
			toast.error(t("error_saving_transactions"))
		}
	}

	return (
		<>
			<div className="visible absolute -top-6 left-1/2 flex -translate-x-1/2 items-center justify-center">
				<div
					className={cn(
						"absolute bottom-24 flex flex-col-reverse items-center gap-3",
						isOpen ? "pointer-events-auto" : "pointer-events-none",
					)}
				>
					<ActionPill
						isOpen={isOpen}
						icon={Wallet}
						label={tNav("add_expense")}
						onClick={handleOpenAddExpenseDrawer}
						delay="delay-[50ms]"
					/>

					<ActionPill
						isOpen={isOpen}
						icon={Tag}
						label={tNav("add_category")}
						onClick={handleOpenAddCategoryDrawer}
						delay="delay-[100ms]"
					/>

					<ActionPill
						isOpen={isOpen}
						icon={ScanText}
						label={tNav("scan_statement")}
						onClick={handleOpenImportDrawer}
						delay="delay-[150ms]"
					/>
				</div>

				<Button
					className={cn(
						"group relative z-50 cursor-pointer",
						"h-16 w-16 rounded-full p-0",
						"border-[3px] border-hades-950 bg-primary text-hades-950",
						"shadow-[0_0_20px_rgba(var(--color-hades-500-rgb),0.3)]",
						"transition-all duration-300 hover:scale-105 active:scale-95",
						"flex items-center justify-center overflow-visible",
						"[&_svg]:size-6",
					)}
					onClick={toggleMenu}
				>
					<div
						className={cn(
							"absolute top-4 right-1 left-1 -z-10 h-full rounded-full",
							"bg-linear-to-tr from-(--color-hades-500) to-cyan-400",
							"opacity-0 blur-lg transition-all duration-500",
							isOpen && "translate-y-2 scale-110 opacity-60",
						)}
					/>

					<Plus
						strokeWidth={3}
						className={cn(
							"text-hades-950",
							"transition-transform duration-300 ease-in-out",
							isOpen && "rotate-135",
						)}
					/>
				</Button>
			</div>

			<ImportTransactionDrawer
				isOpen={showImportDrawer}
				onClose={() => setShowImportDrawer(false)}
				onConfirm={handleImportConfirm}
				isSubmitting={importLoading}
			/>

			<CreateExpenseDrawer
				isOpen={showAddExpenseDrawer}
				onClose={() => setShowAddExpenseDrawer(false)}
				onConfirm={handleCreateExpenseConfirm}
				isSubmitting={createLoading}
			/>

			<CreateCategoryDrawer
				isOpen={showAddCategoryDrawer}
				onClose={() => setShowAddCategoryDrawer(false)}
				onConfirm={handleCreateCategoryConfirm}
				isSubmitting={createCategoryLoading}
			/>
		</>
	)
}
