import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"
import { ThemeProvider } from "@/components/providers/theme-provider/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/providers/auth-provider"

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

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
					<ApolloWrapper>
						<NextIntlClientProvider messages={messages}>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								{children}
								<Toaster />
							</ThemeProvider>
						</NextIntlClientProvider>
					</ApolloWrapper>
				</AuthProvider>
			</body>
		</html>
	)
}
