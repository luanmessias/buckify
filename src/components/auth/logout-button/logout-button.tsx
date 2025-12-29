"use client"

import { signOut } from "firebase/auth"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"

export function LogoutButton() {
	const t = useTranslations("Transactions")

	const router = useRouter()

	const handleLogout = async () => {
		await signOut(auth)
		await logout()

		router.refresh()
		router.push("/login")
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleLogout}
			title={t("logout")}
		>
			<LogOut className="h-5 w-5" />
		</Button>
	)
}
