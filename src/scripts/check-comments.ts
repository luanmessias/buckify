import fs from "node:fs"
import { globSync } from "glob"

// BUSCA ARQUIVOS
// Usamos o filter manual para garantir 100% que a pasta scripts será ignorada
const files = globSync("src/**/*.{ts,tsx}", {
	ignore: "node_modules/**",
}).filter((f) => !f.includes("src/scripts/"))

let hasError = false

// REGEX APRIMORADA 3.0:
// 1. (?<!:)      -> Ignora http:// (protocolos)
// 2. (?<!image)  -> Ignora image/* (MIME types comuns)
// 3. (\/\/|\/\*) -> Busca // ou /*
// 4. (?!...)     -> Garante que NÃO é seguido pelas tags permitidas
const invalidCommentRegex =
	/(?<!:)(?<!image)(\/\/|\/\*)(?!\s*(TODO|WARNING|FIXME|eslint-disable|biome-ignore))/

console.log(
	`🔍 Verificando comentários (inclusive inline) em ${files.length} arquivos...`,
)

files.forEach((file: string) => {
	const content = fs.readFileSync(file, "utf-8")
	const lines = content.split("\n")

	lines.forEach((line, index) => {
		// Ignora linhas vazias
		if (!line.trim()) return

		if (invalidCommentRegex.test(line)) {
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
