import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
	const cookieStore = await cookies()
	const localeCookie = cookieStore.get("NEXT_LOCALE")?.value

	const locale = localeCookie || "pt"

	const validLocales = ["en", "pt"]
	const finalLocale = validLocales.includes(locale) ? locale : "pt"

	return {
		locale: finalLocale,
		messages: (await import(`../../src/messages/${finalLocale}.json`)).default,
	}
})
