"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/ui/button"

interface ThemeToggleProps extends ButtonProps {}

export const ThemeToggle = ({
	className,
	variant = "ghost",
	size = "icon",
	...props
}: ThemeToggleProps) => {
	const { setTheme } = useTheme()

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={toggleTheme}
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
