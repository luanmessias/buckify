import fs from "node:fs"
import path from "node:path"
import { globSync } from "glob"

const MESSAGES_DIR = path.join(process.cwd(), "src/messages")
const MASTER_LANG_FILE = "en.json"
const SRC_DIR = path.join(process.cwd(), "src")

interface KeyInfo {
	path: string[]
	dotPath: string
	leaf: string
}

function getKeyMap(
	obj: Record<string, unknown>,
	currentPath: string[] = [],
): KeyInfo[] {
	let keys: KeyInfo[] = []

	for (const key in obj) {
		const newPath = [...currentPath, key]

		if (
			typeof obj[key] === "object" &&
			obj[key] !== null &&
			!Array.isArray(obj[key])
		) {
			keys = keys.concat(
				getKeyMap(obj[key] as Record<string, unknown>, newPath),
			)
		} else {
			keys.push({
				path: newPath,
				dotPath: newPath.join("."),
				leaf: key,
			})
		}
	}
	return keys
}

function deleteKey(obj: Record<string, unknown>, pathParts: string[]) {
	const head = pathParts[0]
	if (pathParts.length === 1) {
		if (obj && Object.hasOwn(obj, head)) {
			delete obj[head]
		}
		return
	}
	if (obj[head]) {
		deleteKey(obj[head] as Record<string, unknown>, pathParts.slice(1))
		if (Object.keys(obj[head] as Record<string, unknown>).length === 0) {
			delete obj[head]
		}
	}
}

async function main() {
	console.log(
		"🧹 Iniciando limpeza SEGURA de chaves não utilizadas (Modo Next-Intl)...",
	)

	const masterPath = path.join(MESSAGES_DIR, MASTER_LANG_FILE)
	if (!fs.existsSync(masterPath)) {
		console.error("❌ Master file não encontrado.")
		process.exit(1)
	}

	const masterContent = JSON.parse(
		fs.readFileSync(masterPath, "utf-8"),
	) as Record<string, unknown>
	const allKeys = getKeyMap(masterContent)

	console.log(`📊 Total de chaves para analisar: ${allKeys.length}`)

	const files = globSync(`${SRC_DIR}/**/*.{ts,tsx}`, {
		ignore: [
			"**/node_modules/**",
			"**/*.d.ts",
			"**/messages/**",
			"**/scripts/**",
		],
	})

	let fullCode = ""
	files.forEach((f) => {
		fullCode += fs.readFileSync(f, "utf-8")
	})

	const unusedKeys: KeyInfo[] = []

	allKeys.forEach((info) => {
		const leafPattern = info.leaf.replace(/\./g, "\\.")

		const leafRegex = new RegExp(`['"]${leafPattern}['"]`)

		if (!leafRegex.test(fullCode)) {
			const dotPathRegex = new RegExp(
				`['"]${info.dotPath.replace(/\./g, "\\.")}['"]`,
			)

			if (!dotPathRegex.test(fullCode)) {
				unusedKeys.push(info)
			}
		}
	})

	if (unusedKeys.length === 0) {
		console.log("✅ Nenhuma chave órfã encontrada.")
		return
	}

	console.log(`⚠️  Encontradas ${unusedKeys.length} chaves suspeitas:`)
	unusedKeys.slice(0, 10).forEach((k) => {
		console.log(`   - ${k.dotPath}`)
	})
	if (unusedKeys.length > 10)
		console.log(`   ... e mais ${unusedKeys.length - 10}`)

	const backupDir = path.join(process.cwd(), "backups-i18n")
	if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir)
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

	fs.readdirSync(MESSAGES_DIR).forEach((file) => {
		if (file.endsWith(".json")) {
			fs.copyFileSync(
				path.join(MESSAGES_DIR, file),
				path.join(backupDir, `${file}.${timestamp}.bak`),
			)
		}
	})
	console.log(
		`💾 Backup de segurança criado em ./backups-i18n (NÃO DELETE AINDA!)`,
	)

	const jsonFiles = fs
		.readdirSync(MESSAGES_DIR)
		.filter((f) => f.endsWith(".json"))

	jsonFiles.forEach((file) => {
		const filePath = path.join(MESSAGES_DIR, file)
		const content: Record<string, unknown> = JSON.parse(
			fs.readFileSync(filePath, "utf-8"),
		)

		unusedKeys.forEach((info) => {
			deleteKey(content, info.path)
		})

		fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`)
		console.log(`🗑️  Limpo: ${file}`)
	})

	console.log("\n✨ Limpeza concluída!")
	console.log(
		"👉 DICA: Use 'git diff' agora. Se apagou algo que não devia, restaure o backup ou dê revert.",
	)
}

main()
