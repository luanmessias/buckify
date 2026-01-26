"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface NavbarItemProps {
	href: string
	icon: LucideIcon
	label: string
}

export const NavbarItem = ({ href, icon: Icon, label }: NavbarItemProps) => {
	const pathname = usePathname()

	const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)

	return (
		<Link
			href={href}
			className={cn(
				"group flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl transition-all",
				"active:scale-95",
			)}
		>
			<Icon
				className={cn(
					"h-6 w-6 shrink-0 transition-all duration-300",
					"scale-100 text-muted-foreground",
					"group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-(--color-hades-300)",
					isActive && "scale-110 text-(--color-hades-300)",
				)}
			/>

			<Typography
				variant="small"
				className={cn(
					"font-medium text-[10px] transition-all duration-300",
					"text-muted-foreground opacity-70",
					"group-hover:text-(--color-hades-300) group-hover:opacity-100",
					isActive && "font-bold text-(--color-hades-300) opacity-100",
				)}
			>
				{label}
			</Typography>
		</Link>
	)
}
