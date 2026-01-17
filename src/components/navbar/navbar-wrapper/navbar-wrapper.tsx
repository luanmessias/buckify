"use client"

import { BarChart3, CreditCard, House, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { NavbarItem } from "@/components/navbar/navbar-item/navbar-item"
import { cn } from "@/lib/utils"
import { AddNavigation } from "../add-navigation/add-navigation"

export const NavbarWrapper = () => {
	const t = useTranslations("Navigation")
	const [isVisible, setIsVisible] = useState(true)
	const lastScrollY = useRef(0)

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY

			if (currentScrollY < 0) return

			if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
				setIsVisible(false)
			} else {
				setIsVisible(true)
			}

			lastScrollY.current = currentScrollY
		}

		window.addEventListener("scroll", handleScroll, { passive: true })

		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<nav
			className={cn(
				"fixed bottom-0 h-(--navbar-height) w-full",
				"flex items-center justify-center",
				"border-b bg-background/80 backdrop-blur-md",
				"border-white/5 border-t",
				"shadow-[0_-5px_20px_rgba(0,0,0,0.3)]",
				"z-40",
				"transition-transform duration-300 ease-in-out",
				isVisible ? "translate-y-0" : "translate-y-full",
				"pb-[calc(0.5rem+env(safe-area-inset-bottom))]",
			)}
		>
			<AddNavigation />

			<div className="grid h-full w-full max-w-md grid-cols-5 items-center px-4">
				<NavbarItem href="/" icon={House} label={t("home")} />
				<NavbarItem href="/stats" icon={BarChart3} label={t("stats")} />

				<div className="pointer-events-none" />

				<NavbarItem href="/cards" icon={CreditCard} label={t("cards")} />
				<NavbarItem href="/profile" icon={User} label={t("profile")} />
			</div>
		</nav>
	)
}
