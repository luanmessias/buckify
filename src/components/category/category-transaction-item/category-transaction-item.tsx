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
			className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-colors hover:bg-card/80"
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
