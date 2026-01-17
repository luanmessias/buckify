import { twMerge } from "tailwind-merge"

type SeparatorProps = {
	className?: string
}

export const Divider = ({ className }: SeparatorProps) => {
	return (
		<div
			className={twMerge(
				"my-8 h-px w-full bg-linear-to-r from-transparent via-border to-transparent",
				className,
			)}
		/>
	)
}
