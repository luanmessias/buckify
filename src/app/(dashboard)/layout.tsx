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
		<div className="flex min-h-screen flex-col pt-(--topbar-height) pb-(--navbar-height)">
			<Header />
			<main className="container mx-auto flex-1">{children}</main>
			<NavbarWrapper />
		</div>
	)
}
