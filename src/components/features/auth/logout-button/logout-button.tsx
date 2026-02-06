"use client"

import { signOut } from "firebase/auth"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { logout } from "@/app/actions/auth"
import { Button, type ButtonProps } from "@/components/ui/button"
import { auth } from "@/lib/firebase"

interface LogoutButtonProps extends ButtonProps {}

export function LogoutButton({
	variant = "ghost",
	size = "icon",
	className,
	...props
}: LogoutButtonProps) {
	const t = useTranslations("UserArea")

	const router = useRouter()

	const handleLogout = async () => {
		sessionStorage.removeItem("login_toast_shown")
		await signOut(auth)
		await logout()

		router.refresh()
		router.push("/login")
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleLogout}
			title={t("logout_button")}
			aria-label={t("logout_button")}
			className={className}
			{...props}
		>
			<LogOut className="h-5 w-5" />
		</Button>
	)
}
