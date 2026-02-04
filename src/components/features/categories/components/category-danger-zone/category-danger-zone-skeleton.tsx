import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CategoryDangerZoneSkeleton = () => {
	return (
		<Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/10">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pt-6 pb-6">
				<div className="space-y-2">
					<Skeleton className="h-5 w-32 bg-red-200/50 dark:bg-red-900/30" />
					<Skeleton className="h-4 w-64 bg-red-200/50 dark:bg-red-900/30" />
				</div>
				<Skeleton className="ml-4 h-10 w-36 bg-red-200/50 dark:bg-red-900/30" />
			</CardHeader>
		</Card>
	)
}
