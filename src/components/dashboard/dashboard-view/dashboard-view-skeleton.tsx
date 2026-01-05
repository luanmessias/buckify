import { CategoryCardSkeleton } from "@/components/dashboard/category-card/category-card-skeleton"
import { SummarySkeleton } from "@/components/dashboard/summary/summary-skeleton" // Aquele que criamos antes
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardViewSkeleton() {
	return (
		<div className="space-y-4 animate-in fade-in duration-500">
			<div className="flex justify-between items-center p-4">
				<Skeleton className="h-10 w-[20%] rounded-md bg-muted/50" />
				<Skeleton className="h-10 w-[40%] rounded-md" />
				<Skeleton className="h-10 w-[20%] rounded-md bg-muted/50" />
			</div>

			<SummarySkeleton />

			<div className="grid p-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<CategoryCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
