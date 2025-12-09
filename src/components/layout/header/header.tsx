"use client"

import { LogOut } from "lucide-react"
import { removeSession } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/layout/theme-toggle/theme-toggle"
import { Button } from "@/components/ui/button"

export const Header = () => {
	return (
		<header className="flex items-center px-4 h-16 ">
			<ThemeToggle />

			<Button
				variant="ghost"
				size="icon"
				onClick={async () => removeSession()}
				title="Sair"
			>
				<LogOut className="h-5 w-5" />
			</Button>
		</header>
	)
}
