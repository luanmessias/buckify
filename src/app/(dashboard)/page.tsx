import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { DashboardView } from "@/components/features/dashboard/dashboard-view/dashboard-view"

export default function DashboardPage() {
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		notFound()
	}

	return <DashboardView householdId={householdId} />
}
