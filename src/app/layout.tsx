import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import "./globals.css"
import type { Viewport } from "next"
import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import NextTopLoader from "nextjs-toploader"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"
import { ThemeProvider } from "@/components/providers/theme-provider/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/providers/auth-provider"
import StoreProvider from "@/providers/store-provider"

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
}

const geistSans = Roboto({
	variable: "--roboto",
	weight: "400",
	subsets: ["latin"],
})

const geistMono = Roboto_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Buckify",
	description: "Controle financeiro inteligente",
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const locale = await getLocale()
	const messages = await getMessages()

	const cookieStore = cookies()
	const householdId = cookieStore.get("householdId")?.value || ""

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground antialiased`}
			>
				<NextTopLoader
					color="#22c55e"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					easing="ease"
					speed={200}
					shadow="0 0 10px #22c55e,0 0 5px #22c55e"
				/>

				<NextIntlClientProvider messages={messages}>
					<StoreProvider initialHouseholdId={householdId}>
						<AuthProvider>
							<ApolloWrapper>
								<ThemeProvider
									attribute="class"
									defaultTheme="system"
									enableSystem
									disableTransitionOnChange
								>
									{children}
									<Toaster />
								</ThemeProvider>
							</ApolloWrapper>
						</AuthProvider>
					</StoreProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
