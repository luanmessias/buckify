import { Header } from "@/components/layout/header/header"
import { NavbarWrapper } from "@/components/navbar/navbar-wrapper/navbar-wrapper"

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col min-h-screen pb-(--navbar-height)">
			<Header />
			<main className="flex-1 container mx-auto">{children}</main>
			<NavbarWrapper />
		</div>
	)
}
