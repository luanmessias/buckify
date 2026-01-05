import fs from "node:fs"
import glob from "glob" // pnpm add -D glob

// Pega todos os arquivos ts/tsx, ignorando node_modules
const files = glob.sync("src/**/*.{ts,tsx}")
let hasError = false

// Regex: Procura // ou /* que NÃO seja seguido de TODO, WARNING, FIXME ou eslint-disable
const invalidCommentRegex =
	/(\/\/|\/\*)(?!\s*(TODO|WARNING|FIXME|eslint-disable))/

files.forEach((file) => {
	const content = fs.readFileSync(file, "utf-8")
	const lines = content.split("\n")

	lines.forEach((line, index) => {
		// Only check lines that start with comment markers (after whitespace)
		const trimmed = line.trim()
		if (trimmed.startsWith("//") || trimmed.startsWith("/*")) {
			if (invalidCommentRegex.test(line)) {
				console.error(`❌ Erro em ${file}:${index + 1}`)
				console.error(`   Comentário não permitido: "${line.trim()}"`)
				console.error(`   Regra: Comentários devem ter TODO ou WARNING.\n`)
				hasError = true
			}
		}
	})
})

if (hasError) process.exit(1)
console.log("✅ Verificação de comentários aprovada!")
