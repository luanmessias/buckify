import fs from "node:fs"
import path from "node:path"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import { GEMINI_API_MODEL } from "@/lib/ai/config"
import { generateTranslationPrompt } from "@/lib/ai/prompts/sync-i18n-messages"
import { MASTER_LOCALE, SUPPORTED_LANGUAGES } from "../i18n/i18n-config"

dotenv.config({ path: ".env.local" })

type TranslationValue = string | TranslationObject
interface TranslationObject {
	[key: string]: TranslationValue
}

const MESSAGES_DIR = path.join(process.cwd(), "src/messages")
const MASTER_LANG_FILE = `${MASTER_LOCALE}.json`
const MASTER_LANG_CODE = SUPPORTED_LANGUAGES[MASTER_LOCALE]

const TARGET_LANGS = Object.entries(SUPPORTED_LANGUAGES)
	.filter(([code]) => code !== MASTER_LOCALE)
	.reduce(
		(acc, [code, name]) => {
			acc[`${code}.json`] = name
			return acc
		},
		{} as Record<string, string>,
	)

const apiKey =
	process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
if (!apiKey) {
	console.error("❌ Erro: GEMINI_API_KEY não encontrada no .env.local")
	process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

const isObject = (item: unknown): item is TranslationObject => {
	return typeof item === "object" && item !== null && !Array.isArray(item)
}

const isMissingValue = (value: unknown): boolean => {
	return typeof value === "string" && value.startsWith("__MISSING__")
}

function getMissingKeys(
	master: TranslationObject,
	slave: TranslationObject,
): TranslationObject | null {
	const missing: TranslationObject = {}
	let hasMissing = false

	Object.keys(master).forEach((key) => {
		const masterValue = master[key]
		const slaveValue = slave?.[key]

		if (isObject(masterValue)) {
			const nestedSlave = isObject(slaveValue) ? slaveValue : {}
			const nestedMissing = getMissingKeys(masterValue, nestedSlave)

			if (nestedMissing && Object.keys(nestedMissing).length > 0) {
				missing[key] = nestedMissing
				hasMissing = true
			}
			return
		}

		if (slaveValue === undefined || isMissingValue(slaveValue)) {
			missing[key] = masterValue
			hasMissing = true
		}
	})

	return hasMissing ? missing : null
}

function mergeAndSort(
	master: TranslationObject,
	slave: TranslationObject,
	translatedMissing: TranslationObject | null,
): TranslationObject {
	const sorted: TranslationObject = {}

	Object.keys(master)
		.sort()
		.forEach((key) => {
			const masterValue = master[key]
			const slaveValue = slave?.[key]
			const translatedValue = translatedMissing?.[key]

			if (isObject(masterValue)) {
				sorted[key] = mergeAndSort(
					masterValue,
					isObject(slaveValue) ? slaveValue : {},
					isObject(translatedValue) ? translatedValue : null,
				)
				return
			}

			if (translatedValue !== undefined) {
				sorted[key] = translatedValue
			} else if (slaveValue !== undefined && !isMissingValue(slaveValue)) {
				sorted[key] = slaveValue
			} else if (slaveValue !== undefined && isMissingValue(slaveValue)) {
				sorted[key] = slaveValue
			} else {
				sorted[key] = `__MISSING__ ${masterValue}`
			}
		})

	return sorted
}

async function translatePayload(
	payload: TranslationObject,
	targetLang: string,
): Promise<TranslationObject | null> {
	try {
		const payloadSize = JSON.stringify(payload).length
		if (payloadSize > 30000)
			console.warn(`⚠️ Payload grande (${payloadSize} chars).`)

		const prompt = generateTranslationPrompt(
			MASTER_LANG_CODE,
			targetLang,
			payload,
		)

		const { text } = await ai.models.generateContent({
			model: GEMINI_API_MODEL,
			contents: prompt,
			config: { responseMimeType: "application/json" },
		})

		const cleanJson = text ? text.trim() : "{}"
		return JSON.parse(cleanJson)
	} catch (error) {
		console.error(
			`⚠️ Erro CRÍTICO ao traduzir para ${targetLang}:`,
			error instanceof Error ? error.message : String(error),
		)
		return null
	}
}

async function main() {
	const masterPath = path.join(MESSAGES_DIR, MASTER_LANG_FILE)

	if (!fs.existsSync(masterPath)) {
		console.error(`❌ Arquivo Master não encontrado: ${masterPath}`)
		process.exit(1)
	}

	const masterContent = JSON.parse(
		fs.readFileSync(masterPath, "utf-8"),
	) as TranslationObject

	console.log(
		`🤖 Iniciando AI Translation Sync (Base: ${MASTER_LANG_FILE})...\n`,
	)

	const existingFiles = fs
		.readdirSync(MESSAGES_DIR)
		.filter((f) => f.endsWith(".json"))

	const allowedFiles = new Set([MASTER_LANG_FILE, ...Object.keys(TARGET_LANGS)])

	for (const file of existingFiles) {
		if (!allowedFiles.has(file)) {
			const filePath = path.join(MESSAGES_DIR, file)
			console.log(`🗑️ Idioma removido da config. Deletando arquivo: ${file}`)
			fs.unlinkSync(filePath)
		}
	}

	for (const [fileName, langName] of Object.entries(TARGET_LANGS)) {
		const filePath = path.join(MESSAGES_DIR, fileName)
		let slaveContent: TranslationObject = {}
		let isNewFile = false

		if (!fs.existsSync(filePath)) {
			console.log(
				`🆕 Novo idioma detectado: ${langName} (${fileName}). Criando arquivo...`,
			)
			fs.writeFileSync(filePath, "{}")
			isNewFile = true
		}

		try {
			slaveContent = JSON.parse(
				fs.readFileSync(filePath, "utf-8"),
			) as TranslationObject
		} catch (_e) {
			console.error(`⚠️ JSON inválido em ${fileName}. Resetando.`)
			slaveContent = {}
		}

		const missingKeys = getMissingKeys(masterContent, slaveContent)
		let translatedData: TranslationObject | null = null

		if (missingKeys && Object.keys(missingKeys).length > 0) {
			const keysCount = JSON.stringify(missingKeys).split(":").length - 1
			console.log(
				`🌍 ${isNewFile ? "Traduzindo ARQUIVO COMPLETO" : "Reparando/Sincronizando"} ${keysCount} chaves para ${fileName} (${langName})...`,
			)
			translatedData = await translatePayload(missingKeys, langName)
		} else {
			console.log(`✅ ${fileName} já está 100% sincronizado.`)
		}

		const finalContent = mergeAndSort(
			masterContent,
			slaveContent,
			translatedData,
		)
		fs.writeFileSync(filePath, `${JSON.stringify(finalContent, null, 2)}\n`)
	}

	const sortedMaster = mergeAndSort(masterContent, masterContent, null)
	fs.writeFileSync(masterPath, `${JSON.stringify(sortedMaster, null, 2)}\n`)

	console.log("\n✨ Sync concluído com sucesso!")
}

main().catch((err) => {
	console.error("Fatal Error:", err)
	process.exit(1)
})
