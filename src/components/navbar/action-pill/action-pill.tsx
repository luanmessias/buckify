import type { LucideIcon } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface ActionPillProps {
	isOpen: boolean
	icon: LucideIcon
	label: string
	onClick: () => void
	delay?: string
	isPremium?: boolean
}

export const ActionPill = ({
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
				"group flex items-center cursor-pointer justify-start gap-3 pl-2 pr-4 py-2 rounded-full w-48",
				"border backdrop-blur-md shadow-lg transition-all duration-300 ease-out",
				"bg-[#1a1d21]/90 border-white/10 text-muted-foreground",
				"hover:bg-[#1a1d21] hover:border-(--color-hades-300) hover:text-white hover:scale-105",

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
					"group-hover:bg-(--color-hades-300) group-hover:text-black",
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
