import { format, parseISO } from "date-fns"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import type { Transaction } from "@/lib/types"

interface CategoryTransactionItemProps {
	transaction: Transaction
	onEdit?: (transaction: Transaction) => void
}

export const CategoryTransactionItem = ({
	transaction,
	onEdit,
}: CategoryTransactionItemProps) => {
	const t = useTranslations("Category")

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(val)

	return (
		<Card
			className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
			onClick={() => onEdit?.(transaction)}
		>
			<div className="flex flex-col gap-1">
				<Typography className="font-medium text-sm">
					{transaction.description}
				</Typography>
				<Typography variant="muted" className="text-xs">
					{format(parseISO(transaction.date), "dd/MM/yyyy")}
				</Typography>
			</div>
			<Typography className="font-bold text-sm">
				{formatCurrency(transaction.amount)}
			</Typography>
		</Card>
	)
}
