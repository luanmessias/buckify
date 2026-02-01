"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { Logo } from "@/components/common/logo/logo"
import { UserArea } from "@/components/features/auth/user-area/user-area"
import { cn } from "@/lib/utils"

export const Header = () => {
	const t = useTranslations("Common")

	const [isVisible, setIsVisible] = useState(true)
	const lastScrollY = useRef(0)

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY

			if (currentScrollY < 10) {
				setIsVisible(true)
				return
			}

			if (currentScrollY > lastScrollY.current + 10) {
				setIsVisible(false)
			} else if (currentScrollY < lastScrollY.current - 10) {
				setIsVisible(true)
			}

			lastScrollY.current = currentScrollY
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<header
			data-testid="main-header"
			className={cn(
				"fixed top-0 right-0 left-0 z-50",
				"h-16 w-full",
				"flex items-center justify-between px-4 py-4",
				"border-b bg-background/80 backdrop-blur-md",
				"transition-transform duration-300 ease-in-out",
				isVisible ? "translate-y-0" : "-translate-y-full",
			)}
		>
			<div>
				<Link href="/">
					<Logo
						data-testid="header-logo"
						className="h-7 text-primary"
						title={t("logo_title")}
					/>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<UserArea />
			</div>
		</header>
	)
}
