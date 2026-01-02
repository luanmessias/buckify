"use client"

import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { createSession } from "@/app/actions/auth"
import { auth } from "@/lib/firebase"

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const sessionCreationInProgress = useRef(false)
	const redirectChecked = useRef(false)

	useEffect(() => {
		const handleLogin = async (user: User) => {
			if (sessionCreationInProgress.current) return

			sessionCreationInProgress.current = true

			try {
				const idToken = await user.getIdToken()
				await createSession(idToken)

				if (!sessionStorage.getItem("login_toast_shown")) {
					toast.success("Login realizado!")
					sessionStorage.setItem("login_toast_shown", "true")
				}

				router.refresh()
			} catch (error) {
				console.error("Auth error:", error)
				toast.error("Falha na sessão")
				sessionCreationInProgress.current = false
			}
		}

		const checkRedirect = async () => {
			if (redirectChecked.current) return
			redirectChecked.current = true

			try {
				const result = await getRedirectResult(auth)
				if (result?.user) {
					await handleLogin(result.user)
				}
			} catch (error) {
				console.error("Redirect error:", error)
			}
		}

		checkRedirect()

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				await handleLogin(user)
			}
		})

		return () => unsubscribe()
	}, [router])

	return <>{children}</>
}
