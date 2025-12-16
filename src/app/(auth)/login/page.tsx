"use client"

import { signInWithPopup } from "firebase/auth"
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
		<Card className="relative w-full max-w-sm mx-auto border">
			<div className="absolute right-0 top-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>

			<CardHeader className="space-y-1 text-center">
				<Logo variant="icon" className="h-20 w-auto text-primary" />
				<Logo variant="text" className="h-12 text-primary" />
				<CardDescription>{t("login_subtitle")}</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-4">
				<Button
					variant="outline"
					className="cursor-pointer w-full py-6 group flex h-14 items-center justify-center rounded-xl bg-[linear-gradient(to_right,#5D6F6E,#636E70,#A7B6A3,#81B8B3,#A0D199)] p-0.5 text-white transition duration-300 hover:bg-[linear-gradient(to_left,#5D6F6E,#636E70,#A7B6A3,#81B8B3,#A0D199)] hover:shadow-2xl hover:shadow-[#81B8B3]/30"
					onClick={handleGoogleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						t("connecting")
					) : (
						<div className="flex gap-2 h-full w-full uppercase items-center justify-center rounded-xl bg-[#0f1115] transition duration-300 ease-in-out group-hover:bg-white/5 group-hover:text-black">
							{t("google_button")}
						</div>
					)}
				</Button>
			</CardContent>
		</Card>
	)
}
