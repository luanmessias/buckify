import fs from "node:fs"
import { globSync } from "glob"

const files = globSync("src/**/*.{ts,tsx}", {
	ignore: ["node_modules/**", "src/lib/ai/prompts/**"],
})
let hasError = false

const invalidCommentRegex =
	/(\/\/|\/\*)(?!\s*(TODO|WARNING|FIXME|eslint-disable|biome-ignore))/

console.log(
	`🔍 Verificando comentários (inclusive inline) em ${files.length} arquivos...`,
)

files.forEach((file: string) => {
	const content = fs.readFileSync(file, "utf-8")
	const lines = content.split("\n")

	lines.forEach((line, index) => {
		if (!line.trim()) return

		let cleanLine = line

		try {
			cleanLine = cleanLine.replace(/\/((?:\\.|[^\\/])+)\/[gimuy]*/g, "")
		} catch (_e) {}

		cleanLine = cleanLine.replace(/(["'`])(?:\\.|[^\\])*?\1/g, "")

		if (invalidCommentRegex.test(cleanLine)) {
			console.error(`❌ Erro em ${file}:${index + 1}`)
			console.error(`   Comentário não permitido: "${line.trim()}"`)
			console.error(
				`   Regra: Comentários devem ter TODO, WARNING, FIXME, etc.\n`,
			)
			hasError = true
		}
	})
})

if (hasError) {
	process.exit(1)
}

console.log("✅ Verificação de comentários aprovada!")
