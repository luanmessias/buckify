export const SUPPORTED_LANGUAGES = {
	en: "English (US)",
} as const

export type Locale = keyof typeof SUPPORTED_LANGUAGES

export const MASTER_LOCALE: Locale = "en"

export const availableLocales = Object.keys(SUPPORTED_LANGUAGES) as Locale[]
