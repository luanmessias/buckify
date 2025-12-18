import type { Locale } from "date-fns"
import { enUS, ptBR } from "date-fns/locale"
import { useLocale } from "next-intl"

const locales: Record<string, Locale> = {
	pt: ptBR,
	en: enUS,
}

export function useDateFnsLocale() {
	const locale = useLocale()

	return locales[locale] ?? ptBR
}
