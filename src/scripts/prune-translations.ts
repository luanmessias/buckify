import fs from "node:fs"
import path from "node:path"
import { globSync } from "glob"

// --- CONFIG ---
const MESSAGES_DIR = path.join(process.cwd(), "src/messages")
const MASTER_LANG_FILE = "pt.json" // O arquivo base para análise
const SRC_DIR = path.join(process.cwd(), "src")

// Tipagem para o objeto de chaves
interface KeyInfo {
	path: string[] // ["Transactions", "buttons", "logout"]
	dotPath: string // "Transactions.buttons.logout"
	leaf: string // "logout" (a chave final que buscamos no código)
}

// 1. Aplaina o JSON mas guarda metadados sobre a chave
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
				leaf: key, // Salva a ponta ("logout")
			})
		}
	}
	return keys
}

// 2. Remove chave do objeto (mutável)
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
		// Limpeza de objetos vazios após deleção
		if (Object.keys(obj[head] as Record<string, unknown>).length === 0) {
			delete obj[head]
		}
	}
}

async function main() {
	console.log(
		"🧹 Iniciando limpeza SEGURA de chaves não utilizadas (Modo Next-Intl)...",
	)

	// A. Carrega chaves
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

	// B. Lê código fonte
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

	// C. Análise de Uso (Lógica Safe)
	const unusedKeys: KeyInfo[] = []

	allKeys.forEach((info) => {
		// Busca 1: Chave final exata (ex: "logout")
		// Busca 2: Chave aninhada parcial (ex: "buttons.logout" - comum se namespace for só 'Transactions')
		// Busca 3: Caminho completo (ex: "Transactions.buttons.logout" - raro no next-intl mas possível)

		// Regex busca por: aspas + (logout OU buttons.logout OU full.path) + aspas
		// Escapamos o ponto para a regex funcionar
		const leafPattern = info.leaf.replace(/\./g, "\\.")

		// Verifica se a chave final (leaf) existe entre aspas
		const leafRegex = new RegExp(`['"]${leafPattern}['"]`)

		// Opcional: Verifica se partes maiores do caminho existem (para evitar colisão de nomes muito comuns como "id")
		// Mas para segurança máxima, se acharmos a LEAF, consideramos em uso.

		if (!leafRegex.test(fullCode)) {
			// Se não achou a folha 'logout', tenta ver se achou o caminho intermediário (caso raro)
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
	// Mostra só as primeiras 10 para não poluir
	unusedKeys.slice(0, 10).forEach((k) => {
		console.log(`   - ${k.dotPath}`)
	})
	if (unusedKeys.length > 10)
		console.log(`   ... e mais ${unusedKeys.length - 10}`)

	// D. BACKUP OBRIGATÓRIO
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

	// E. Remoção
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
