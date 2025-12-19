"use client"

import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
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
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const t = useTranslations("Auth")

	const handleGoogleLogin = async () => {
		setIsLoading(true)

		try {
			const userCredential = await signInWithPopup(auth, googleProvider)

			createSession(userCredential.user.uid)

			toast.success(t("success_toast"), {
				description: t("redirecting"),
			})

			router.push("/")
		} catch (_err) {
			toast.error(t("error_title"), {
				description: t("error_description"),
				action: {
					label: t("retry"),
					onClick: () => handleGoogleLogin(),
				},
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className="relative w-full max-w-sm mx-auto border">
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
