"use client"

import { BarChart3, CreditCard, House, User } from "lucide-react"
import { NavbarItem } from "@/components/navbar/navbar-item/navbar-item"
import { cn } from "@/lib/utils"
import { AddNavigation } from "../add-navigation/add-navigation"

export const NavbarWrapper = () => {
	return (
		<nav
			className={cn(
				"fixed bottom-0 w-full h-(--navbar-height) pb-2",
				"flex items-center justify-center",
				"bg-[#1a1d21]/80 backdrop-blur-xl",
				"border-t border-white/5",
				"shadow-[0_-5px_20px_rgba(0,0,0,0.3)]",
				"z-40",
			)}
		>
			<AddNavigation />

			<div className="grid grid-cols-5 w-full max-w-md px-4 h-full items-center">
				<NavbarItem href="/" icon={House} label="HOME" />
				<NavbarItem href="/stats" icon={BarChart3} label="STATS" />

				<div className="pointer-events-none" />

				<NavbarItem href="/cards" icon={CreditCard} label="CARDS" />
				<NavbarItem href="/profile" icon={User} label="PERFIL" />
			</div>
		</nav>
	)
}
