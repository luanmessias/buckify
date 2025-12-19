import type { LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import dynamic from "next/dynamic"

interface IconProps extends LucideProps {
	name: string
}

export const Icon = ({ name, ...props }: IconProps) => {
	const kebabName = name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase() as keyof typeof dynamicIconImports

	const LucideIcon = dynamicIconImports[kebabName]
		? dynamic(dynamicIconImports[kebabName])
		: dynamic(dynamicIconImports["circle-help"])

	return <LucideIcon {...props} />
}
