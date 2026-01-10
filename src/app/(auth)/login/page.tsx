"use client"

import { signInWithPopup, signInWithRedirect } from "firebase/auth"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { devLogin } from "@/actions/dev-auth"
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
	const tCommon = useTranslations("Common")

	const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true"

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
				<Logo
					variant="icon"
					className="h-20 w-auto text-primary"
					title={tCommon("logo_title")}
				/>
				<Logo
					variant="text"
					className="h-12 text-primary"
					title={tCommon("logo_title")}
				/>
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

				{isDevMode && (
					<form action={devLogin} className="mt-4">
						<button
							type="submit"
							className="w-full p-3 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 rounded-lg text-sm font-bold border border-emerald-500/50 transition-all"
						>
							{t("dev_mode_button")}
						</button>
					</form>
				)}
			</CardContent>
		</Card>
	)
}
