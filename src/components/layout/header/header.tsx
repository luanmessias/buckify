"use client"

import { useTranslations } from "next-intl"
import { LogoutButton } from "@/components/auth/logout-button/logout-button"
import { ThemeToggle } from "@/components/layout/theme-toggle/theme-toggle"
import { Logo } from "@/components/ui/logo"

export const Header = () => {
	const t = useTranslations("Common")
	return (
		<header
			className="
				flex items-center justify-between
				px-4 py-4 h-16 border-b bg-background"
		>
			<div>
				<Logo className="text-primary h-7" title={t("logo_title")} />
			</div>

			<div>
				<ThemeToggle />

				<LogoutButton />
			</div>
		</header>
	)
}
