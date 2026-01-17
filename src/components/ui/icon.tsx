import type { LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import dynamic from "next/dynamic"
import { useMemo } from "react"

interface IconProps extends LucideProps {
	name: string
}

export const Icon = ({ name, ...props }: IconProps) => {
	const kebabName = name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase() as keyof typeof dynamicIconImports

	const LucideIcon = useMemo(() => {
		const iconImport = dynamicIconImports[kebabName]
			? dynamicIconImports[kebabName]
			: dynamicIconImports["circle-help"]

		return dynamic(iconImport)
	}, [kebabName])

	return <LucideIcon {...props} />
}
