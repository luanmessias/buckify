import { Skeleton } from "@/components/ui/skeleton"

export const CategoryHeaderSkeleton = () => {
	return (
		<div className="sticky top-0 z-40 bg-background/80 px-4 py-3 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<Skeleton className="h-6 w-6 rounded-md" />

				<div className="flex flex-1 justify-center">
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>

				<Skeleton className="h-10 w-10 rounded-md" />
			</div>
		</div>
	)
}
