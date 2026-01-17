import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RadiantButtonProps {
	children: React.ReactNode
	isLoading?: boolean
	className?: string
	disabled?: boolean
	onClick: () => void
}

export const RadiantButton = ({
	className,
	isLoading = false,
	children,
	disabled,
	onClick,
	...props
}: RadiantButtonProps) => {
	const t = useTranslations("Auth")

	return (
		<Button
			variant="outline"
			className={cn(
				"group relative h-14 w-full cursor-pointer overflow-hidden rounded-xl border-none p-[1.5px] transition-all duration-300",
				"bg-[linear-gradient(to_right,#5D6F6E,#636E70,#A7B6A3,#81B8B3,#A0D199)]",
				"hover:bg-[linear-gradient(to_left,#5D6F6E,#636E70,#A7B6A3,#81B8B3,#A0D199)] hover:shadow-2xl hover:shadow-[#81B8B3]/30",
				className,
			)}
			onClick={onClick}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading ? (
				<div className="flex items-center gap-2 text-muted-foreground">
					<Loader2 className="h-5 w-5 animate-spin text-primary" />
					<span className="font-medium text-black text-sm uppercase tracking-widest">
						{t("connecting")}
					</span>
				</div>
			) : (
				<div className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-[#0f1115] uppercase transition duration-300 ease-in-out group-hover:bg-white/5 group-hover:text-black">
					{t("google_button")}
				</div>
			)}
		</Button>
	)
}
