import {
	addMonths,
	format,
	isAfter,
	isSameMonth,
	parseISO,
	subMonths,
} from "date-fns"
import { useDateFnsLocale } from "@/hooks/use-date-fns-locale"

interface MonthOptionsProps {
	month: string
	onSelectDate: (month: string) => void
}

export const MonthOptions = ({ month, onSelectDate }: MonthOptionsProps) => {
	const currentLocale = useDateFnsLocale()

	const selectedMonth = parseISO(month)
	const prevMonth = subMonths(selectedMonth, 1)
	const nextMonth = addMonths(selectedMonth, 1)

	const todayDate = new Date()
	const futureLimitDate = addMonths(todayDate, 1)

	const isFutureBlocked =
		isAfter(selectedMonth, futureLimitDate) ||
		isSameMonth(selectedMonth, futureLimitDate)

	const labels = {
		selectedMonth: format(selectedMonth, "MMMM yyyy", {
			locale: currentLocale,
		}),
		prevMonth: format(prevMonth, "MMM yyyy", { locale: currentLocale }),
		nextMonth: format(nextMonth, "MMM yyyy", { locale: currentLocale }),
	}

	const handleDateClick = (selectedDate: Date) => {
		const formattedDate = format(selectedDate, "yyyy-MM")
		onSelectDate(formattedDate)
	}

	return (
		<div className="w-full p-4">
			<nav className="flex w-full items-center justify-around">
				<button
					type="button"
					className="cursor-pointer hover:opacity-75 transition-opacity uppercase"
					onClick={() => handleDateClick(prevMonth)}
				>
					{labels.prevMonth}
				</button>

				<div className="flex relative py-2 px-6 border-2 bg-primary rounded-lg text-xl text-tea text-gray-950 font-bold pointer uppercase">
					<div className="absolute -left-1 top-4.5 w-2 h-2 bg-background rotate-45" />
					{labels.selectedMonth}
					<div className="absolute -right-1 top-4.5 w-2 h-2 bg-background rotate-45" />
				</div>

				<button
					type="button"
					className={`cursor-pointer transition-opacity uppercase ${
						isFutureBlocked
							? "opacity-30 cursor-not-allowed"
							: "hover:opacity-75"
					}`}
					disabled={isFutureBlocked}
					onClick={() => handleDateClick(nextMonth)}
				>
					{labels.nextMonth}
				</button>
			</nav>
		</div>
	)
}
