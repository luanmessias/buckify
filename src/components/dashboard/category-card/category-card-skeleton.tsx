import { Skeleton } from "@/components/ui/skeleton"

export const CategoryCardSkeleton = () => {
	return (
		<div className="bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Skeleton className="w-6 h-6 rounded-lg" />
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>

				<Skeleton className="h-4 w-8" />
			</div>

			<Skeleton className="h-2 w-full rounded-full" />

			<div className="flex justify-between items-center mt-1">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	)
}
