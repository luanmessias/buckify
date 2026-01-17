import { AnimatedWrapper } from "@/components/layout/animated-wrapper/animated-wrapper"
import type { Transaction } from "@/lib/types"
import { CategoryTransactionItem } from "../category-transaction-item/category-transaction-item"

interface CategoryTransactionListProps {
	transactions: Transaction[]
}

export const CategoryTransactionList = ({
	transactions,
}: CategoryTransactionListProps) => {
	const sortedTransactions = [...transactions].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	return (
		<div className="flex flex-col gap-2">
			{sortedTransactions.map((transaction, index) => (
				<AnimatedWrapper key={transaction.id} delay={index * 0.1}>
					<CategoryTransactionItem
						transaction={transaction}
						onEdit={(t) => console.log("Edit transaction", t)}
					/>
				</AnimatedWrapper>
			))}
		</div>
	)
}
