"use client"

import { ChevronsUpDown, Search, X } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
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

function useMediaQuery(query: string) {
	const [value, setValue] = useState(false)

	useEffect(() => {
		function onChange(event: MediaQueryListEvent) {
			setValue(event.matches)
		}

		const result = matchMedia(query)
		result.addEventListener("change", onChange)
		setValue(result.matches)

		return () => result.removeEventListener("change", onChange)
	}, [query])

	return value
}

interface IconPickerProps {
	value: string
	onChange: (value: string) => void
	className?: string
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const t = useTranslations("Components")

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn(
							"w-full justify-between",
							"bg-transparent font-normal hover:bg-transparent hover:text-foreground",
							"px-3 py-1 text-base md:text-sm",
							className,
						)}
					>
						<SelectedIconDisplay value={value} placeholder={t("select_icon")} />
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-75 p-0" align="start">
					<IconPickerContent
						value={value}
						onChange={(icon) => {
							onChange(icon)
							setOpen(false)
						}}
					/>
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between",
						"bg-transparent font-normal hover:bg-transparent hover:text-foreground",
						"px-3 py-1 text-base md:text-sm",
						className,
					)}
				>
					<SelectedIconDisplay value={value} placeholder={t("select_icon")} />
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="h-[80vh]">
				<DrawerHeader className="text-left px-4 pt-4">
					<DrawerTitle>{t("select_icon")}</DrawerTitle>
				</DrawerHeader>
				<div className="px-4 pb-4 h-full overflow-hidden flex flex-col">
					<IconPickerContent
						value={value}
						onChange={(icon) => {
							onChange(icon)
							setOpen(false)
						}}
					/>
					<DrawerClose asChild className="mt-4">
						<Button variant="outline" className="w-full">
							{t("cancel")}
						</Button>
					</DrawerClose>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

function SelectedIconDisplay({
	value,
	placeholder,
}: {
	value: string
	placeholder: string
}) {
	if (value) {
		return (
			<div className="flex items-center gap-2">
				<Icon name={value} className="h-4 w-4" />
				<span>{value}</span>
			</div>
		)
	}
	return (
		<Typography as="span" className="text-muted-foreground">
			{placeholder}
		</Typography>
	)
}

function IconPickerContent({
	value,
	onChange,
}: {
	value: string
	onChange: (val: string) => void
}) {
	const t = useTranslations("Components")
	const [search, setSearch] = useState("")

	const icons = useMemo(
		() =>
			Object.keys(dynamicIconImports) as (keyof typeof dynamicIconImports)[],
		[],
	)

	const filteredIcons = useMemo(() => {
		const lowerSearch = search.toLowerCase()
		if (!lowerSearch) return icons.slice(0, 100)
		return icons
			.filter((icon) => icon.toLowerCase().includes(lowerSearch))
			.slice(0, 100)
	}, [search, icons])

	return (
		<div className="flex flex-col h-full space-y-4">
			<div className="relative">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder={t("search_icon")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-8 text-base md:text-sm"
				/>
				{search && (
					<button
						onClick={() => setSearch("")}
						type="button"
						className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>

			<ScrollArea className="flex-1 -mx-1">
				<div className="grid grid-cols-5 sm:grid-cols-6 gap-2 p-1">
					{filteredIcons.map((iconName) => (
						<Button
							key={iconName}
							variant={value === iconName ? "default" : "outline"}
							className={cn(
								"h-12 w-full p-0 aspect-square",
								value === iconName && "bg-primary text-primary-foreground",
							)}
							onClick={() => onChange(iconName)}
							title={iconName}
						>
							<Icon name={iconName} className="h-6 w-6" />{" "}
							<span className="sr-only">{iconName}</span>
						</Button>
					))}
					{filteredIcons.length === 0 && (
						<Typography
							variant="muted"
							className="col-span-full py-8 text-center"
						>
							{t("no_icons_found")}
						</Typography>
					)}
				</div>
			</ScrollArea>
		</div>
	)
}
