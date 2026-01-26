import { CategoryHeaderSkeleton } from "@/components/features/categories/components/category-header/category-header-skeleton"
import { CategorySummarySkeleton } from "@/components/features/categories/components/category-summary/category-summary-skeleton"
import { CategoryTransactionListSkeleton } from "@/components/features/categories/components/category-transaction-list/category-transaction-list-skeleton"
import { ListFilterSkeleton } from "@/components/ui/list-filter-skeleton"

export default function Loading() {
	return (
		<div className="fade-in flex animate-in flex-col gap-4 p-4 duration-500">
			<CategoryHeaderSkeleton />
			<CategorySummarySkeleton />
			<ListFilterSkeleton />
			<CategoryTransactionListSkeleton />
		</div>
	)
}
