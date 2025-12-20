"use client"

import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { logout } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/layout/theme-toggle/theme-toggle"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export const Header = () => {
	const t = useTranslations("Transactions")

	return (
		<header
			className="
				flex items-center justify-between
				px-4 py-4 h-16 border-b bg-background"
		>
			<div>
				<Logo className="text-primary h-7" />
			</div>
			<div>
				<ThemeToggle />

				<Button
					variant="ghost"
					size="icon"
					onClick={() => logout()}
					title={t("logout")}
				>
					<LogOut className="h-5 w-5" />
				</Button>
			</div>
		</header>
	)
}
