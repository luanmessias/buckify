import fs from "node:fs"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import { globSync } from "glob"
import { GEMINI_API_MODEL } from "@/lib/ai/config"
import { generateFixCommentsPrompt } from "../lib/ai/prompts/fix-comments"

dotenv.config({ path: ".env.local" })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
	console.error("❌ Erro: API Key não encontrada.")
	process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

const invalidCommentRegex =
	/(\/\/|\/\*)(?!\s*(TODO|WARNING|FIXME|eslint-disable|biome-ignore))/

async function cleanCodeWithAI(filePath: string, code: string) {
	try {
		const prompt = generateFixCommentsPrompt(code)

		const { text } = await ai.models.generateContent({
			model: GEMINI_API_MODEL,
			contents: prompt,
			config: { responseMimeType: "text/plain" },
		})

		if (!text) throw new Error("Retorno vazio da IA")

		const cleanText = text
			.replace(/^```(typescript|ts|js)?\n/i, "")
			.replace(/\n```$/, "")

		return cleanText
	} catch (error) {
		console.error(`⚠️ Falha ao limpar ${filePath}:`, error)
		return null
	}
}

async function main() {
	const files = globSync("src/**/*.{ts,tsx}", {
		ignore: ["node_modules/**", "src/lib/ai/prompts/**"],
	})

	console.log(
		`🔍 Buscando arquivos com comentários inválidos em ${files.length} arquivos...`,
	)

	let processedCount = 0

	for (const file of files) {
		const content = fs.readFileSync(file, "utf-8")
		const lines = content.split("\n")

		let needsCleaning = false

		for (const line of lines) {
			if (!line.trim()) continue

			let cleanLine = line
			try {
				cleanLine = cleanLine.replace(/\/((?:\\.|[^\\/])+)\/[gimuy]*/g, "")
			} catch (_e) {}
			cleanLine = cleanLine.replace(/(["'`])(?:\\.|[^\\])*?\1/g, "")

			if (invalidCommentRegex.test(cleanLine)) {
				needsCleaning = true
				break
			}
		}

		if (needsCleaning) {
			console.log(`🧹 Limpando com IA: ${file}...`)

			const cleanedCode = await cleanCodeWithAI(file, content)

			if (cleanedCode) {
				if (cleanedCode.length < content.length * 0.7) {
					console.error(
						`🚨 ABORTADO: A IA parece ter deletado código em ${file}. Revise manualmente.`,
					)
				} else {
					fs.writeFileSync(file, cleanedCode)
					console.log(`✨ Arquivo limpo salvo!`)
					processedCount++
				}
			}

			await new Promise((r) => setTimeout(r, 500))
		}
	}

	if (processedCount === 0) {
		console.log("✅ Nenhum arquivo precisou de limpeza.")
	} else {
		console.log(`\n🎉 Processo finalizado. ${processedCount} arquivos limpos.`)
		console.log(
			"⚠️  DICA: Rode 'git diff' para garantir que a IA não alterou lógica.",
		)
	}
}

main()
