"use client"

import {
	addMonths,
	format,
	isAfter,
	isValid,
	type Locale,
	parseISO,
	setMonth,
	setYear,
	startOfMonth,
} from "date-fns"
import {
	CalendarIcon,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useDateFnsLocale } from "@/hooks/use-date-fns-locale"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface MonthSelectorProps {
	className: string
}

export const MonthSelector = ({ className }: MonthSelectorProps) => {
	const t = useTranslations("Common")
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const currentLocale = useDateFnsLocale()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const monthParam = searchParams.get("month")

	const currentDate = useMemo(() => {
		if (monthParam) {
			const parsed = parseISO(monthParam)
			if (isValid(parsed)) return parsed
		}
		return new Date()
	}, [monthParam])

	const onSelectDate = (newMonthStr: string) => {
		const params = new URLSearchParams(searchParams)
		params.set("month", newMonthStr)
		replace(`${pathname}?${params.toString()}`)
		setIsOpen(false)
	}

	const setIsOpen = (value: boolean) => {
		setOpen(value)
	}

	const TriggerButton = (
		<div className={cn("flex w-full items-center", className)}>
			<Button
				variant="outline"
				className={cn(
					"w-full justify-between text-left font-normal",
					"border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50",
					"h-12 rounded-xl px-4 shadow-sm transition-colors",
				)}
			>
				<div className="flex items-center gap-3">
					<CalendarIcon className="h-4 w-4 text-zinc-400" />
					<span className="text-lg uppercase tracking-wider">
						{format(currentDate, "MMMM yyyy", { locale: currentLocale })}
					</span>
				</div>
				<ChevronDown className="h-4 w-4 text-zinc-500 opacity-50" />
			</Button>
		</div>
	)

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
				<PopoverContent
					className="w-75 border-zinc-800 bg-zinc-950 p-0 text-zinc-100"
					align="start"
				>
					<MonthGrid
						currentDate={currentDate}
						locale={currentLocale}
						onSelect={onSelectDate}
					/>
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
			<DrawerContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
				<DrawerTitle className="sr-only">{t("select_month")}</DrawerTitle>
				<div className="mt-4 border-zinc-800 border-t pt-4 pb-8">
					<MonthGrid
						currentDate={currentDate}
						locale={currentLocale}
						onSelect={onSelectDate}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

interface MonthGridProps {
	currentDate: Date
	locale: Locale
	onSelect: (date: string) => void
}

function MonthGrid({ currentDate, locale, onSelect }: MonthGridProps) {
	const t = useTranslations("Common")
	const [menuYear, setMenuYear] = useState<number>(currentDate.getFullYear())
	const searchParams = useSearchParams()
	const pathname = usePathname()

	useEffect(() => {
		setMenuYear(currentDate.getFullYear())
	}, [currentDate])

	const today = new Date()
	const maxDate = startOfMonth(addMonths(today, 1))

	const nextYear = () => setMenuYear(menuYear + 1)
	const prevYear = () => setMenuYear(menuYear - 1)

	const isMonthDisabled = (monthIndex: number) => {
		const dateToCheck = startOfMonth(
			setMonth(setYear(new Date(), menuYear), monthIndex),
		)
		return isAfter(dateToCheck, maxDate)
	}

	const shortMonths = Array.from({ length: 12 }, (_, i) => {
		const d = setMonth(new Date(), i)
		return format(d, "MMM", { locale: locale })
	})

	return (
		<div className="mx-auto max-w-87.5 p-4">
			<div className="mb-6 flex items-center justify-between px-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={prevYear}
					className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
					aria-label={t("previous_year")}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<div className="font-medium text-xl tracking-wide">{menuYear}</div>

				<Button
					variant="ghost"
					size="icon"
					onClick={nextYear}
					className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
					aria-label={t("next_year")}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<div className="grid grid-cols-3 gap-3">
				{shortMonths.map((m, i) => {
					const isSelected =
						currentDate.getMonth() === i &&
						currentDate.getFullYear() === menuYear

					const isDisabled = isMonthDisabled(i)

					const targetDate = setMonth(setYear(currentDate, menuYear), i)
					const monthStr = format(targetDate, "yyyy-MM")

					const newParams = new URLSearchParams(searchParams?.toString())
					newParams.set("month", monthStr)
					const href = `${pathname}?${newParams.toString()}`

					return (
						<Button
							key={m}
							asChild
							variant="ghost"
							disabled={isDisabled}
							className={cn(
								"h-12 font-medium text-xs uppercase tracking-wider transition-all duration-200 sm:h-10",
								"text-zinc-400 hover:bg-zinc-800 hover:text-white",
								isSelected && [
									"bg-[#4ADE80] text-black hover:bg-[#4ADE80] hover:text-black",
									"shadow-[0_0_20px_-5px_#4ADE80]",
									"scale-105 font-bold",
								],
								isDisabled &&
									"pointer-events-none cursor-not-allowed opacity-30 hover:bg-transparent",
							)}
						>
							<Link
								href={href}
								onClick={() => onSelect(monthStr)}
								prefetch={true}
							>
								{m}
							</Link>
						</Button>
					)
				})}
			</div>
		</div>
	)
}
