import { Header } from "@/components/layout/header/header"

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 container mx-auto">{children}</main>
		</div>
	)
}
