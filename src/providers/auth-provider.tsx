"use client"

import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { createSession } from "@/app/actions/auth"
import { setUser } from "@/lib/features/user/user-slice"
import { auth } from "@/lib/firebase"
import { useAppDispatch } from "@/lib/hooks"

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const t = useTranslations("Auth")
	const sessionCreationInProgress = useRef(false)
	const redirectChecked = useRef(false)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const handleLogin = async (user: User) => {
			if (sessionCreationInProgress.current) return

			sessionCreationInProgress.current = true

			try {
				const idToken = await user.getIdToken()
				await createSession(idToken)

				if (!sessionStorage.getItem("login_toast_shown")) {
					toast.success(t("success_toast"))
					sessionStorage.setItem("login_toast_shown", "true")
				}

				router.refresh()
			} catch (error) {
				console.error("Auth error:", error)
				toast.error(t("session_error"))
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
				dispatch(
					setUser({
						uid: user.uid,
						email: user.email,
						name: user.displayName,
						photoURL: user.photoURL,
					}),
				)
			} else {
				const isDevMode =
					typeof document !== "undefined" &&
					document.cookie.includes("buckify_dev_mode=true")

				if (isDevMode) {
					console.log(
						"🟢 [AuthProvider] Mantendo sessão fake de Dev Mode no Client",
					)
					dispatch(
						setUser({
							uid: "dev-user-id",
							email: "dev@buckify.com",
							name: "Developer Mode",
							photoURL:
								"https://api.dicebear.com/9.x/avataaars/svg?seed=BuckifyDev",
						}),
					)
				} else {
					dispatch(setUser(null))
				}
			}
		})

		return () => unsubscribe()
	}, [dispatch, router, t])

	return children
}
