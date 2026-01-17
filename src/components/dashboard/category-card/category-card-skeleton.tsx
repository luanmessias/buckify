import { Skeleton } from "@/components/ui/skeleton"

export const CategoryCardSkeleton = () => {
	return (
		<div className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-border/40 bg-card p-3">
			<div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
				<Skeleton className="absolute h-full w-full rounded-full" />
				<Skeleton className="z-10 h-10 w-10 rounded-full" />
			</div>

			<div className="flex flex-1 flex-col justify-center gap-1">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-8" />
				</div>

				<Skeleton className="h-3 w-32" />

				<div className="mt-1 flex items-center justify-between border-border/30 border-t pt-1.5">
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>
		</div>
	)
}
