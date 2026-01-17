import { CategoryCardSkeleton } from "@/components/dashboard/category-card/category-card-skeleton"
import { SummarySkeleton } from "@/components/dashboard/summary/summary-skeleton"

export default function Loading() {
	return (
		<div className="animate-in fade-in duration-500">
			<SummarySkeleton />

			<div className="grid p-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<CategoryCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
