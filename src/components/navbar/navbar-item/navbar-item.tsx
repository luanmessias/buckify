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
				"group flex flex-col gap-1 items-center justify-center h-full w-full rounded-xl transition-all",
				"active:scale-95",
			)}
		>
			<Icon
				className={cn(
					"w-6 h-6 shrink-0 transition-all duration-300",
					"text-muted-foreground scale-100",
					"group-hover:text-(--color-hades-300) group-hover:-translate-y-1 group-hover:scale-110",
					isActive && "text-(--color-hades-300) scale-110",
				)}
			/>

			<Typography
				variant="small"
				className={cn(
					"text-[10px] font-medium transition-all duration-300",
					"text-muted-foreground opacity-70",
					"group-hover:text-(--color-hades-300) group-hover:opacity-100",
					isActive && "text-(--color-hades-300) opacity-100 font-bold",
				)}
			>
				{label}
			</Typography>
		</Link>
	)
}
