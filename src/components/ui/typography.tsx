import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
	variants: {
		variant: {
			h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
			h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
			h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
			h4: "scroll-m-20 text-xl font-semibold tracking-tight",
			p: "leading-7 [&:not(:first-child)]:mt-6",
			blockquote: "mt-6 border-l-2 pl-6 italic",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			muted: "text-sm text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "p",
	},
})

const defaultTags: Record<
	NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
	React.ElementType
> = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	p: "p",
	blockquote: "blockquote",
	lead: "p",
	large: "div",
	small: "small",
	muted: "p",
}

type TypographyProps<T extends React.ElementType> = {
	as?: T
	className?: string
	children: React.ReactNode
} & VariantProps<typeof typographyVariants> &
	React.ComponentPropsWithoutRef<T>

export const Typography = <T extends React.ElementType = "p">({
	as,
	variant = "p",
	className,
	children,
	...props
}: TypographyProps<T>) => {
	const Component = as || defaultTags[variant || "p"]

	return (
		<Component
			className={cn(typographyVariants({ variant }), className)}
			{...props}
		>
			{children}
		</Component>
	)
}
