import { Skeleton } from "@/components/ui/skeleton"

export const ListFilterSkeleton = () => {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 px-1">
				<Skeleton className="h-4 w-4 rounded-md" />
				<Skeleton className="h-5 w-24" />
			</div>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Skeleton className="h-10 w-full rounded-md" />
				</div>
				<div className="w-[150px]">
					<Skeleton className="h-10 w-full rounded-md" />
				</div>
			</div>
		</div>
	)
}
