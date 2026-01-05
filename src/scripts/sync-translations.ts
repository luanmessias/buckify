import fs from "node:fs"
import path from "node:path"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

// 1. Carrega variáveis de ambiente
dotenv.config({ path: ".env.local" })

// --- TIPAGEM ---
type TranslationValue = string | TranslationObject
interface TranslationObject {
	[key: string]: TranslationValue
}

// --- CONFIGURAÇÃO ---
const MESSAGES_DIR = path.join(process.cwd(), "src/messages")
const MASTER_LANG_FILE = "pt.json"
const MASTER_LANG_CODE = "Portuguese (Brazil)"

// 📝 Configure aqui os idiomas do seu projeto.
// Se você adicionar um novo aqui que não existe na pasta, o script criará para você.
const TARGET_LANGS: Record<string, string> = {
	"en.json": "English (US)",
	"es.json": "Spanish",
	"fr.json": "French",
	"de.json": "German",
	// "ja.json": "Japanese", // Exemplo: Descomente para criar Japonês automaticamente
}

// Verifica API Key
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
if (!apiKey) {
	console.error(
		"❌ Erro: GOOGLE_GENERATIVE_AI_API_KEY não encontrada no .env.local",
	)
	process.exit(1)
}

// Inicializa o Gemini (SDK Nova)
const ai = new GoogleGenAI({ apiKey })

// --- HELPERS ---

const isObject = (item: unknown): item is TranslationObject => {
	return typeof item === "object" && item !== null && !Array.isArray(item)
}

// 1. Identifica chaves que existem no Master mas faltam no Slave
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
			// Se slaveValue não for objeto (ex: undefined), trata como objeto vazio
			const nestedSlave = isObject(slaveValue) ? slaveValue : {}
			const nestedMissing = getMissingKeys(masterValue, nestedSlave)

			if (nestedMissing && Object.keys(nestedMissing).length > 0) {
				missing[key] = nestedMissing
				hasMissing = true
			}
			return
		}

		// Caso base: Chave não existe no arquivo de destino
		if (slaveValue === undefined) {
			missing[key] = masterValue
			hasMissing = true
		}
	})

	return hasMissing ? missing : null
}

// 2. Mescla Master, Slave e Traduções novas
function mergeAndSort(
	master: TranslationObject,
	slave: TranslationObject,
	translatedMissing: TranslationObject | null,
): TranslationObject {
	const sorted: TranslationObject = {}

	// Ordena alfabeticamente baseado no MASTER
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

			// Prioridade: 1. Existente -> 2. Tradução Nova -> 3. Fallback
			if (slaveValue !== undefined) {
				sorted[key] = slaveValue
			} else if (translatedValue !== undefined) {
				sorted[key] = translatedValue
			} else {
				sorted[key] = `__MISSING__ ${masterValue}`
			}
		})

	return sorted
}

// 3. Chama a AI para traduzir
async function translatePayload(
	payload: TranslationObject,
	targetLang: string,
): Promise<TranslationObject | null> {
	try {
		const prompt = `
      You are a professional translator for a Finance App. 
      Translate the values of the following JSON from '${MASTER_LANG_CODE}' to '${targetLang}'.
      
      Rules:
      1. Keep the JSON structure and keys EXACTLY the same.
      2. Only translate the values (strings).
      3. Do not add any explanation, only return the valid JSON string.
      
      JSON to translate:
      ${JSON.stringify(payload, null, 2)}
    `

		const { text } = await ai.models.generateContent({
			model: "gemini-1.5-flash",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
			},
		})

		const cleanJson = text ? text.trim() : "{}"
		return JSON.parse(cleanJson)
	} catch (error) {
		console.error(
			`⚠️ Erro ao traduzir para ${targetLang}:`,
			error instanceof Error ? error.message : String(error),
		)
		return null
	}
}

// --- MAIN ---
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

	// Itera sobre a CONFIGURAÇÃO, permitindo criar novos arquivos
	for (const [fileName, langName] of Object.entries(TARGET_LANGS)) {
		const filePath = path.join(MESSAGES_DIR, fileName)
		let slaveContent: TranslationObject = {}
		let isNewFile = false

		// A. Auto-Criação de Arquivo
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

		// B. Detecta Diff
		const missingKeys = getMissingKeys(masterContent, slaveContent)
		let translatedData: TranslationObject | null = null

		if (missingKeys) {
			console.log(
				`🌍 ${isNewFile ? "Traduzindo TUDO" : "Sincronizando"} para ${fileName} (${langName})...`,
			)

			translatedData = await translatePayload(missingKeys, langName)
		} else {
			console.log(`✅ ${fileName} já está sincronizado.`)
		}

		// C. Salva
		const finalContent = mergeAndSort(
			masterContent,
			slaveContent,
			translatedData,
		)
		fs.writeFileSync(filePath, `${JSON.stringify(finalContent, null, 2)}\n`)
	}

	// D. Ordena o Master também
	const sortedMaster = mergeAndSort(masterContent, masterContent, null)
	fs.writeFileSync(masterPath, `${JSON.stringify(sortedMaster, null, 2)}\n`)

	console.log("\n✨ Sync concluído com sucesso!")
}

main().catch((err) => {
	console.error("Fatal Error:", err)
	process.exit(1)
})
