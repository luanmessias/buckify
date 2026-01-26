import { CategoryCardSkeleton } from "@/components/features/categories/components/category-card/category-card-skeleton"
import { SummarySkeleton } from "@/components/features/dashboard/summary-cards/summary-skeleton"
import { ListFilterSkeleton } from "@/components/ui/list-filter-skeleton"

export default function Loading() {
	return (
		<div className="fade-in flex animate-in flex-col gap-4 py-4 duration-500">
			<SummarySkeleton />

			<div className="px-4">
				<ListFilterSkeleton />
			</div>

			<div className="grid grid-cols-1 gap-4 px-4 pb-8 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<CategoryCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
