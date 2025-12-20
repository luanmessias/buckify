import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardView } from "@/components/dashboard/dashboard-view/dashboard-view"

export default function DashboardPage() {
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		redirect("/login")
	}

	return <DashboardView householdId={householdId} />
}
