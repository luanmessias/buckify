import { ThemeToggle } from "@/components/layout/theme-toggle/theme-toggle"

export const Header = () => {
	return (
		<header className="flex items-center px-4 h-16 ">
			<ThemeToggle />
		</header>
	)
}
