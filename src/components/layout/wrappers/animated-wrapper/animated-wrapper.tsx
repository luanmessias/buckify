import { type MotionProps, motion } from "framer-motion"
import type { ElementType, ReactNode } from "react"

interface AnimatedFadeInProps extends MotionProps {
	children: ReactNode
	className?: string
	as?: ElementType
	duration?: number
	delay?: number
}

export const AnimatedWrapper = ({
	children,
	className = "",
	as: Tag = "div",
	duration = 0.5,
	delay = 0,
	...rest
}: AnimatedFadeInProps) => {
	const MotionComponent = motion.create(Tag)

	const variants = {
		hidden: {
			opacity: 0,
			filter: "blur(8px)",
			y: 10,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
			transition: {
				duration: duration,
				delay: delay,
				ease: "easeOut",
			},
		},
	}

	return (
		<MotionComponent
			initial="hidden"
			animate="visible"
			variants={variants}
			className={className}
			{...rest}
		>
			{children}
		</MotionComponent>
	)
}
