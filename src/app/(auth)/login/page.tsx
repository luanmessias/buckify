"use client"

import { signInWithPopup } from "firebase/auth"
import { Chrome } from "lucide-react"
import { useRouter } from "next/navigation"
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

export default function LoginPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

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
				<CardTitle>Buckify</CardTitle>
				<CardDescription>Controle financeiro inteligente</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-4">
				<Button
					variant="outline"
					className="w-full py-6"
					onClick={handleGoogleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						"Loading..."
					) : (
						<div className="flex items-center gap-2">
							<Chrome className="w-5 h-5 text-blue-600" />
							Entrar com Google
						</div>
					)}
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Ou continue com e-mail (Em breve)
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
