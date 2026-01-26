import { Skeleton } from "@/components/ui/skeleton"

export const CategoryTransactionListSkeleton = () => {
	return (
		<div className="flex flex-col gap-2">
			{[1, 2, 3, 4, 5].map((i) => (
				<div
					key={i}
					className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4"
				>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-20" />
					</div>
					<Skeleton className="h-5 w-24" />
				</div>
			))}
		</div>
	)
}
