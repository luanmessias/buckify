import fs from "node:fs"
import path from "node:path"

const enPath = path.join(process.cwd(), "src/messages/en.json")
const translations = JSON.parse(fs.readFileSync(enPath, "utf-8"))

const getNestedValue = (
	obj: Record<string, unknown>,
	path: string,
): string | null => {
	return path.split(".").reduce((prev: unknown, curr: string) => {
		if (prev && typeof prev === "object" && prev !== null && curr in prev) {
			return (prev as Record<string, unknown>)[curr] as unknown
		}
		return null
	}, obj) as string | null
}

export const t = (key: string, params?: Record<string, string>) => {
	let text = getNestedValue(translations, key) || ""

	if (!text) {
		console.warn(`Translation missing for key: ${key}`)
		return key
	}

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			text = text.replace(`{${key}}`, value)
		})
	}

	return text
}
