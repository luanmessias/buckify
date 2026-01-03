import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header/header"
import { NavbarWrapper } from "@/components/navbar/navbar-wrapper/navbar-wrapper"

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col min-h-screen pb-(--navbar-height)">
			<Header />
			<main className="flex-1 container mx-auto">{children}</main>
			<NavbarWrapper />
		</div>
	)
}
