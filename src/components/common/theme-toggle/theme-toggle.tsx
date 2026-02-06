"use client"

import { Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps extends ButtonProps {}

export const ThemeToggle = ({
	className,
	variant = "ghost",
	size = "icon",
	...props
}: ThemeToggleProps) => {
	const { setTheme, resolvedTheme } = useTheme()
	const t = useTranslations("UserArea")

	const toggleTheme = () => {
		setTheme(resolvedTheme === "light" ? "dark" : "light")
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={toggleTheme}
			aria-label={t("theme_toggle_button")}
			className={cn(
				"relative cursor-pointer overflow-hidden",
				size === "icon" && "h-9 w-9 rounded-full",
				className,
			)}
			{...props}
		>
			<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	)
}
