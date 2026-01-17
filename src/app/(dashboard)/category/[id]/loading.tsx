import { CategoryCardSkeleton } from "@/components/dashboard/category-card/category-card-skeleton"
import { SummarySkeleton } from "@/components/dashboard/summary/summary-skeleton"

export default function Loading() {
	return (
		<div className="flex flex-col gap-4 py-4 animate-in fade-in duration-500">
			<SummarySkeleton />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-8">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<CategoryCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
