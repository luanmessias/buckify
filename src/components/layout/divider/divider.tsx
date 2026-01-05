// src/components/ui/Separator.tsx
import { twMerge } from "tailwind-merge"

type SeparatorProps = {
	className?: string
}

export const Divider = ({ className }: SeparatorProps) => {
	return (
		<div
			className={twMerge(
				"h-px w-full bg-linear-to-r from-transparent via-border to-transparent my-8",
				className,
			)}
		/>
	)
}
