"use client"

import { type LucideIcon, Plus, ScanText, Tag, Wallet } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export const AddNavigation = () => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => setIsOpen(!isOpen)

	return (
		<div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center visible">
			<div
				className={cn(
					"absolute bottom-24 flex flex-col-reverse items-center gap-3",
					isOpen ? "pointer-events-auto" : "pointer-events-none",
				)}
			>
				<ActionPill
					isOpen={isOpen}
					icon={Wallet}
					label="Novo Gasto"
					onClick={() => console.log("Gasto")}
					delay="delay-[50ms]"
				/>

				<ActionPill
					isOpen={isOpen}
					icon={Tag}
					label="Nova Categoria"
					onClick={() => console.log("Categoria")}
					delay="delay-[100ms]"
				/>

				<ActionPill
					isOpen={isOpen}
					icon={ScanText}
					label="Ler com IA"
					isPremium
					onClick={() => console.log("IA")}
					delay="delay-[150ms]"
				/>
			</div>

			<Button
				className={cn(
					"group relative z-50 cursor-pointer",
					"w-16 h-16 p-0 rounded-full",
					"bg-primary text-hades-950 border-[3px] border-hades-950",
					"shadow-[0_0_20px_rgba(var(--color-hades-500-rgb),0.3)]",
					"hover:scale-105 active:scale-95 transition-all duration-300",
					"flex items-center justify-center overflow-visible",
					"[&_svg]:size-6",
				)}
				onClick={toggleMenu}
			>
				<div
					className={cn(
						"absolute left-1 right-1 top-4 h-full -z-10 rounded-full",
						"bg-linear-to-tr from-(--color-hades-500) to-cyan-400",
						"opacity-0 blur-lg transition-all duration-500",
						isOpen && "opacity-60 translate-y-2 scale-110",
					)}
				/>

				<Plus
					strokeWidth={3}
					className={cn(
						"text-hades-950",
						"transition-transform duration-300 ease-in-out",
						isOpen && "rotate-135",
					)}
				/>
			</Button>
		</div>
	)
}

interface ActionPillProps {
	isOpen: boolean
	icon: LucideIcon
	label: string
	onClick: () => void
	delay?: string
	isPremium?: boolean
}

const ActionPill = ({
	isOpen,
	icon: Icon,
	label,
	onClick,
	delay,
	isPremium,
}: ActionPillProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group flex items-center justify-start gap-3 pl-2 pr-4 py-2 rounded-full w-48",
				"border backdrop-blur-md shadow-lg transition-all duration-300 ease-out",

				"bg-[#1a1d21]/90 border-white/10 text-muted-foreground",
				"hover:bg-[#1a1d21] hover:border-(--color-hades-500) hover:text-white hover:scale-105",

				isPremium &&
					"border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",

				isOpen
					? `opacity-100 translate-y-0 scale-100 ${delay}`
					: "opacity-0 translate-y-8 scale-90 pointer-events-none",
			)}
		>
			<div
				className={cn(
					"p-2 rounded-full bg-white/5 ring-1 ring-white/10 transition-colors shrink-0",
					"group-hover:bg-(--color-hades-500) group-hover:text-black",
					isPremium && "bg-primary/20 text-primary",
				)}
			>
				<Icon className="w-5 h-5" />
			</div>

			<Typography variant="small" className="font-medium whitespace-nowrap">
				{label}
			</Typography>
		</button>
	)
}
