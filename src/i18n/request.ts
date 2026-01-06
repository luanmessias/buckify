import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { availableLocales, type Locale } from "./i18n-config"

export default getRequestConfig(async () => {
	const cookieStore = await cookies()
	const localeCookie = cookieStore.get("NEXT_LOCALE")?.value

	const locale =
		localeCookie && availableLocales.includes(localeCookie as Locale)
			? localeCookie
			: "en"

	return {
		locale,
		messages: (await import(`../../src/messages/${locale}.json`)).default,
	}
})
