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
				"group flex w-48 cursor-pointer items-center justify-start gap-3 rounded-full py-2 pr-4 pl-2",
				"border shadow-lg backdrop-blur-md transition-all duration-300 ease-out",
				"border-white/10 bg-[#1a1d21]/90 text-muted-foreground",
				"hover:scale-105 hover:border-(--color-hades-300) hover:bg-[#1a1d21] hover:text-white",

				isPremium &&
					"border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",

				isOpen
					? `translate-y-0 scale-100 opacity-100 ${delay}`
					: "pointer-events-none translate-y-8 scale-90 opacity-0",
			)}
		>
			<div
				className={cn(
					"shrink-0 rounded-full bg-white/5 p-2 ring-1 ring-white/10 transition-colors",
					"group-hover:bg-(--color-hades-300) group-hover:text-black",
					isPremium && "bg-primary/20 text-primary",
				)}
			>
				<Icon className="h-5 w-5" />
			</div>

			<Typography variant="small" className="whitespace-nowrap font-medium">
				{label}
			</Typography>
		</button>
	)
}
