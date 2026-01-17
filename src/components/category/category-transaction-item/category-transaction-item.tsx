import { format, parseISO } from "date-fns"
import { useTranslations } from "next-intl"
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
	const _t = useTranslations("Category")

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(val)

	return (
		<button
			type="button"
			className="bg-card/50 border border-border/50 rounded-xl p-4 flex justify-between items-center hover:bg-card/80 transition-colors group relative overflow-hidden cursor-pointer w-full text-left"
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
		</button>
	)
}
