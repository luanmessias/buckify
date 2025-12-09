// Agora sim importamos o Header
import { Header } from "@/components/layout/header/header"

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col min-h-screen">
			{/* O Header aparece fixo no topo para todas as rotas deste grupo */}
			<Header />

			{/* O conteúdo da página (page.tsx) é renderizado aqui dentro */}
			<main className="flex-1 container mx-auto p-4 py-6">{children}</main>
		</div>
	)
}
