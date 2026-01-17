import type { Transaction } from "@/lib/types"
import { CategoryTransactionItem } from "../category-transaction-item/category-transaction-item"

interface CategoryTransactionListProps {
	transactions: Transaction[]
}

export const CategoryTransactionList = ({
	transactions,
}: CategoryTransactionListProps) => {
	// Sort transactions by date descending (newest first)
	const sortedTransactions = [...transactions].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	return (
		<div className="flex flex-col gap-2">
			{sortedTransactions.map((transaction) => (
				<CategoryTransactionItem
					key={transaction.id}
					transaction={transaction}
					// Placeholder for future edit functionality
					onEdit={(t) => console.log("Edit transaction", t)}
				/>
			))}
		</div>
	)
}
