"use client"

import { signInWithPopup } from "firebase/auth"
import { useTranslations } from "next-intl"
import type { JSX } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { createSession } from "@/app/actions/auth"
import { RadiantButton } from "@/components/layout/radiant-button/radiant-button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { auth, googleProvider } from "@/lib/firebase"

export default function LoginPage(): JSX.Element {
	const [isLoading, setIsLoading] = useState(false)

	const t = useTranslations("Auth")

	const handleGoogleLogin = async () => {
		setIsLoading(true)

		try {
			const userCredential = await signInWithPopup(auth, googleProvider)
			const idToken = await userCredential.user.getIdToken()

			toast.info(t("connecting"), {
				description: t("connecting_description"),
			})

			await createSession(idToken)

			toast.success(t("success_toast"), {
				description: t("redirecting"),
			})
		} catch (error) {
			console.error(error)
			toast.error(t("error_title"), {
				description: t("error_description"),
				action: {
					label: t("retry"),
					onClick: () => handleGoogleLogin(),
				},
			})
			setIsLoading(false)
		}
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
					Entrar com Google
				</RadiantButton>
			</CardContent>
		</Card>
	)
}
