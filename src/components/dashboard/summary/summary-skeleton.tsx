import { Skeleton } from "@/components/ui/skeleton"

export const SummarySkeleton = () => {
	return (
		<section className="px-4 space-y-8">
			<div className="relative rounded-2xl p-6 border bg-card/50 flex flex-col">
				<Skeleton className="h-4 w-32 mb-8" />

				<div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
					<div className="relative h-60 w-60 shrink-0 flex items-center justify-center">
						<Skeleton className="h-full w-full rounded-full" />

						<div className="absolute inset-4 rounded-full bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-8 w-32" />
						</div>
					</div>

					<div className="flex-1 w-full space-y-6">
						<div className="flex justify-between md:justify-end gap-10 border-b pb-6">
							<div className="flex flex-col gap-2 items-end">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-6 w-24" />
							</div>
							<div className="flex flex-col gap-2 items-end">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-6 w-24" />
							</div>
						</div>

						<div className="space-y-4 hidden md:block">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex justify-between items-center">
									<div className="flex items-center gap-3">
										<Skeleton className="h-3 w-3 rounded-full" />{" "}
										<Skeleton className="h-4 w-24" />
									</div>
									<Skeleton className="h-4 w-16" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
