"use server"

import { GoogleGenAI } from "@google/genai"
import { cookies } from "next/headers"
import { GEMINI_API_MODEL } from "@/lib/ai/config"
import { generateBankStatementPrompt } from "@/lib/ai/prompts/get-transactions"
import { dbAdmin } from "@/lib/firebase-admin"
import type { ScannedTransaction } from "@/lib/types"

export const scanBankStatement = async (formData: FormData) => {
	const apiKey = process.env.GEMINI_API_KEY
	if (!apiKey) {
		console.error("GEMINI_API_KEY environment variable is not set")
		return {
			success: false,
			error: "Erro de configuração do servidor (API Key ausente).",
		}
	}

	const ai = new GoogleGenAI({ apiKey })

	try {
		const file = formData.get("file") as File

		if (!file) {
			return { success: false, error: "Nenhum arquivo enviado." }
		}

		const householdId = cookies().get("householdId")?.value
		if (!householdId) {
			return {
				success: false,
				error: "Sessão inválida (Household ID não encontrado).",
			}
		}

		const categoriesSnap = await dbAdmin
			.collection("categories")
			.where("householdId", "==", householdId)
			.get()

		const categories = categoriesSnap.docs.map((doc) => ({
			id: doc.id,
			name: doc.data().name,
		}))

		const arrayBuffer = await file.arrayBuffer()
		const base64Data = Buffer.from(arrayBuffer).toString("base64")
		const dynamicPrompt = generateBankStatementPrompt(categories)

		const result = await ai.models.generateContent({
			model: GEMINI_API_MODEL,
			contents: [
				{
					role: "user",
					parts: [
						{ text: dynamicPrompt },
						{
							inlineData: {
								mimeType: file.type,
								data: base64Data,
							},
						},
					],
				},
			],
			config: {
				responseMimeType: "application/json",
			},
		})

		const responseText = result.text
		if (!responseText) throw new Error("A IA não retornou nenhum texto.")

		const cleanJson = responseText.replace(/```json|```/g, "").trim()
		const transactions = JSON.parse(cleanJson) as ScannedTransaction[]

		if (!transactions || transactions.length === 0) {
			return { success: true, data: [], categories }
		}

		const dates = transactions
			.map((t) => t.date)
			.filter((d) => d)
			.sort()

		let transactionsWithFlag = transactions

		if (dates.length > 0) {
			const minDate = dates[0]
			const maxDate = dates[dates.length - 1]

			const existingDocs = await dbAdmin
				.collection("transactions")
				.where("householdId", "==", householdId)
				.where("date", ">=", minDate)
				.where("date", "<=", maxDate)
				.get()

			const existingSignatures = new Set<string>()

			existingDocs.forEach((doc) => {
				const data = doc.data()
				const signature = `${data.date}_${Number(data.amount).toFixed(2)}`
				existingSignatures.add(signature)
			})

			transactionsWithFlag = transactions.map((t) => {
				const currentSignature = `${t.date}_${Number(t.amount).toFixed(2)}`
				return {
					...t,
					isPossibleDuplicate: existingSignatures.has(currentSignature),
				}
			})
		}

		return { success: true, data: transactionsWithFlag, categories }
	} catch (error: unknown) {
		console.error("❌ AI Scan Error:", error)
		if (
			error instanceof Error &&
			(error.message.includes("404") || error.message.includes("Not Found"))
		) {
			return {
				success: false,
				error:
					"Modelo de IA não encontrado. Verifique se a API Key tem permissão.",
			}
		}
		return {
			success: false,
			error: "Falha ao processar o extrato. Tente novamente.",
		}
	}
}
