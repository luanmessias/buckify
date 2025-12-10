"use client"

import { signInWithPopup } from "firebase/auth"
import { Chrome } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { JSX } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { createSession } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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

			toast.success("Login realizado!", {
				description: "Redirecionando para o dashboard...",
			})

			router.push("/")
		} catch (_err) {
			toast.error("Erro ao conectar", {
				description:
					"Não foi possível autenticar com o Google. Tente novamente.",
				action: {
					label: "Tentar",
					onClick: () => handleGoogleLogin(),
				},
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className="border-none shadow-xl w-full max-w-sm mx-auto">
			<CardHeader className="space-y-1 text-center">
				<CardTitle>{t("login_title")}</CardTitle>
				<CardDescription>{t("login_subtitle")}</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-4">
				<Button
					variant="outline"
					className="w-full py-6"
					onClick={handleGoogleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						t("connecting")
					) : (
						<div className="flex items-center gap-2">
							<Chrome className="w-5 h-5 text-blue-600" />
							{t("google_button")}
						</div>
					)}
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
