import { Skeleton } from "@/components/ui/skeleton"

export const CategoryCardSkeleton = () => {
	return (
		<div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Skeleton className="h-6 w-6 rounded-lg" />
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>

				<Skeleton className="h-4 w-8" />
			</div>

			<Skeleton className="h-2 w-full rounded-full" />

			<div className="mt-1 flex items-center justify-between">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	)
}
