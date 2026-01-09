"use client"

import { ChevronsUpDown, Search } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import { useTranslations } from "next-intl"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface IconPickerProps {
	value: string
	onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
	const t = useTranslations("Components")
	const [open, setOpen] = React.useState(false)
	const [search, setSearch] = React.useState("")

	const icons = React.useMemo(
		() =>
			Object.keys(dynamicIconImports) as (keyof typeof dynamicIconImports)[],
		[],
	)

	const filteredIcons = React.useMemo(() => {
		const lowerSearch = search.toLowerCase()
		if (!lowerSearch) return icons.slice(0, 50)
		return icons
			.filter((icon) => icon.toLowerCase().includes(lowerSearch))
			.slice(0, 50)
	}, [search, icons])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value ? (
						<div className="flex items-center gap-2">
							<Icon name={value} className="h-4 w-4" />
							<span>{value}</span>
						</div>
					) : (
						<Typography as="span" className="text-muted-foreground">
							{t("select_icon")}
						</Typography>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full min-w-75 p-0" align="start">
				<div className="p-4 pb-0">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={t("search_icon")}
							className="pl-8"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>
				<ScrollArea className="h-75">
					<div className="grid grid-cols-5 gap-2 p-4">
						{filteredIcons.map((iconName) => (
							<Button
								key={iconName}
								variant={value === iconName ? "default" : "outline"}
								className={cn(
									"h-10 w-10 p-0",
									value === iconName && "bg-primary text-primary-foreground",
								)}
								onClick={() => {
									onChange(iconName)
									setOpen(false)
								}}
								title={iconName}
							>
								<Icon name={iconName} className="h-5 w-5" />
								<span className="sr-only">{iconName}</span>
							</Button>
						))}
						{filteredIcons.length === 0 && (
							<Typography
								variant="muted"
								className="col-span-5 py-4 text-center"
							>
								{t("no_icons_found")}
							</Typography>
						)}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}
