import { Skeleton } from "@/components/ui/skeleton"

export const SummarySkeleton = () => {
	return (
		<section className="space-y-8 px-4">
			<div className="relative flex flex-col rounded-2xl border bg-card/50 p-6">
				<Skeleton className="mb-8 h-4 w-32" />

				<div className="flex h-full flex-col items-center justify-between gap-8 md:flex-row">
					<div className="relative flex h-60 w-60 shrink-0 items-center justify-center">
						<Skeleton className="h-full w-full rounded-full" />

						<div className="absolute inset-4 flex flex-col items-center justify-center gap-2 rounded-full bg-background/50 backdrop-blur-sm">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-8 w-32" />
						</div>
					</div>

					<div className="w-full flex-1 space-y-6">
						<div className="flex justify-between gap-10 border-b pb-6 md:justify-end">
							<div className="flex flex-col items-end gap-2">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-6 w-24" />
							</div>
							<div className="flex flex-col items-end gap-2">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-6 w-24" />
							</div>
						</div>

						<div className="hidden space-y-4 md:block">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center justify-between">
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
