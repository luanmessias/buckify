"use client"

import { signInWithPopup, signInWithRedirect } from "firebase/auth"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { RadiantButton } from "@/components/layout/radiant-button/radiant-button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { isLocalhost } from "@/lib/auth-constants"
import { auth, googleProvider } from "@/lib/firebase"

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false)
	const t = useTranslations("Auth")

	const handleGoogleLogin = () => {
		setIsLoading(true)
		const authFn = isLocalhost() ? signInWithPopup : signInWithRedirect

		authFn(auth, googleProvider).catch((error: unknown) => {
			console.error("Erro no Login:", error)
			if ((error as { code?: string })?.code !== "auth/popup-closed-by-user") {
				toast.error(t("login_error"))
			}
			setIsLoading(false)
		})
	}

	return (
		<Card className="relative w-full max-w-sm mx-auto border bg-card">
			<div className="absolute right-0 top-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
			<CardHeader className="space-y-1 text-center">
				<Logo variant="icon" className="h-20 w-auto text-primary" />
				<Logo variant="text" className="h-12 text-primary" />
				<CardDescription>{t("login_subtitle")}</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<RadiantButton
					onClick={handleGoogleLogin}
					isLoading={isLoading}
					className="w-full"
				>
					{t("google_button")}
				</RadiantButton>
			</CardContent>
		</Card>
	)
}
