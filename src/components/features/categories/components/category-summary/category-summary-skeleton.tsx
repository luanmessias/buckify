import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const CategorySummarySkeleton = () => {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border bg-card p-6 shadow-xl",
			)}
		>
			<div className="flex flex-col items-center justify-center">
				<Skeleton className="mb-4 h-8 w-48" />

				<div className="relative mt-4 flex h-48 w-full max-w-75 items-center justify-center">
					<Skeleton className="h-40 w-40 rounded-full" />
					<div className="absolute flex flex-col items-center gap-2">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>

				<div className="mt-2 flex w-full items-center justify-between border-t pt-4">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-6 w-24" />
					</div>

					<div className="flex flex-col items-end gap-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-6 w-24" />
					</div>
				</div>
			</div>
		</div>
	)
}
