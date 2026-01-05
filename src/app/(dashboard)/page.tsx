import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { DashboardView } from "@/components/dashboard/dashboard-view/dashboard-view"
import { DashboardViewSkeleton } from "@/components/dashboard/dashboard-view/dashboard-view-skeleton"

export default function DashboardPage() {
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		notFound()
	}

	return (
		<Suspense fallback={<DashboardViewSkeleton />}>
			<DashboardView householdId={householdId} />
		</Suspense>
	)
}
