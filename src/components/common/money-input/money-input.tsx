import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MoneyInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	value: number
	onValueChange: (value: number) => void
}

export function MoneyInput({
	value,
	onValueChange,
	className,
	...props
}: MoneyInputProps) {
	const [displayValue, setDisplayValue] = useState(value.toFixed(2))
	const isFocused = useRef(false)

	useEffect(() => {
		if (!isFocused.current) {
			setDisplayValue(value.toFixed(2))
		}
	}, [value])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setDisplayValue(newValue)

		if (newValue === "") {
			onValueChange(0)
			return
		}

		const parsedValue = Number.parseFloat(newValue.replace(",", "."))
		if (!Number.isNaN(parsedValue)) {
			onValueChange(parsedValue)
		}
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		isFocused.current = false
		setDisplayValue(value.toFixed(2))
		props.onBlur?.(e)
	}

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		isFocused.current = true
		props.onFocus?.(e)
	}

	return (
		<input
			type="text"
			inputMode="decimal"
			value={displayValue}
			onChange={handleChange}
			onBlur={handleBlur}
			onFocus={handleFocus}
			className={cn(
				"bg-transparent text-right font-bold font-mono focus:outline-none",
				className,
			)}
			{...props}
		/>
	)
}
