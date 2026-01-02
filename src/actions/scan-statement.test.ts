import { GoogleGenAI } from "@google/genai"
import { cookies } from "next/headers"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { dbAdmin } from "@/lib/firebase-admin"
import { scanBankStatement } from "./scan-statement"

// Mock dependencies
const mockGenerateContent = vi.fn()

vi.mock("@/lib/firebase-admin", () => ({
	dbAdmin: {
		collection: vi.fn(),
	},
	authAdmin: {},
}))

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}))

vi.mock("@google/genai", () => {
	return {
		GoogleGenAI: class MockGoogleGenAI {
			models: any
			constructor(options: any) {
				this.models = {
					generateContent: mockGenerateContent,
				}
			}
		},
	}
})

vi.mock("@/lib/ai/prompts/get-transactions", () => ({
	generateBankStatementPrompt: vi.fn().mockReturnValue("mock prompt"),
}))

// Setup environment variables
process.env.GEMINI_API_KEY = "test-api-key"

describe("scanBankStatement Server Action", () => {
	beforeEach(() => {
		vi.clearAllMocks()

		// Setup Mock Cookie
		;(cookies as any).mockReturnValue({
			get: vi.fn().mockReturnValue({ value: "test-household-id" }),
		})
	})

	it("should return error if no file provided", async () => {
		const formData = new FormData()
		const result = await scanBankStatement(formData)
		expect(result).toEqual({ success: false, error: "Nenhum arquivo enviado." })
	})

	it("should return error if householdId is missing", async () => {
		;(cookies as any).mockReturnValue({
			get: vi.fn().mockReturnValue(undefined), // No cookie
		})

		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)

		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error: "Sessão inválida (Household ID não encontrado).",
		})
	})

	it("should scan file and return transactions", async () => {
		// Mock Firestore categories
		const mockCategories = {
			docs: [
				{ id: "cat1", data: () => ({ name: "Food" }) },
				{ id: "cat2", data: () => ({ name: "Transport" }) },
			],
		}

		// Mock Firestore transactions (for duplicate check)
		const mockExistingTransactions = {
			forEach: vi.fn(), // No existing transactions
		}

		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories) // First call for categories
				.mockResolvedValueOnce(mockExistingTransactions), // Second call for duplicate check
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)

		// Mock AI Response
		const mockAIResponse = {
			text: JSON.stringify([
				{
					date: "2024-01-01",
					description: "Test Transaction",
					amount: 100,
					categoryId: "cat1",
				},
			]),
		}
		mockGenerateContent.mockResolvedValue(mockAIResponse)

		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)

		const result = await scanBankStatement(formData)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data).toHaveLength(1)
			expect(result.data![0].description).toBe("Test Transaction")
			expect(result.data![0].isPossibleDuplicate).toBe(false)
			expect(result.categories).toEqual([
				{ id: "cat1", name: "Food" },
				{ id: "cat2", name: "Transport" },
			])
		}
	})

	it("should mark duplicates if transaction exists", async () => {
		// Mock Firestore categories
		const mockCategories = {
			docs: [],
		}

		// Mock Firestore transactions (existing)
		const mockExistingTransactions = {
			forEach: (callback: any) => {
				callback({ data: () => ({ date: "2024-01-01", amount: 100 }) })
			},
		}

		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)

		// Mock AI Response
		const mockAIResponse = {
			text: JSON.stringify([
				{
					date: "2024-01-01",
					description: "Duplicate Transaction",
					amount: 100,
				},
			]),
		}
		mockGenerateContent.mockResolvedValue(mockAIResponse)

		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)

		const result = await scanBankStatement(formData)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data![0].isPossibleDuplicate).toBe(true)
			expect(result.categories).toEqual([])
		}
	})

	it("should return error if GEMINI_API_KEY is missing", async () => {
		const originalKey = process.env.GEMINI_API_KEY
		delete process.env.GEMINI_API_KEY
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error: "Erro de configuração do servidor (API Key ausente).",
		})
		process.env.GEMINI_API_KEY = originalKey
	})

	it("should return empty data when AI returns empty array", async () => {
		const mockCategories = { docs: [] }
		const mockExistingTransactions = { forEach: vi.fn() }
		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)
		mockGenerateContent.mockResolvedValue({ text: JSON.stringify([]) })
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result.success).toBe(true)
		expect(result.data).toEqual([])
		expect(result.categories).toEqual([])
	})

	it("should return error when AI returns invalid JSON", async () => {
		const mockCategories = { docs: [] }
		const mockExistingTransactions = { forEach: vi.fn() }
		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)
		mockGenerateContent.mockResolvedValue({ text: "invalid json" })
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error: "Falha ao processar o extrato. Tente novamente.",
		})
	})

	it("should return error when AI throws general error", async () => {
		const mockCategories = { docs: [] }
		const mockExistingTransactions = { forEach: vi.fn() }
		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)
		mockGenerateContent.mockRejectedValue(new Error("AI error"))
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error: "Falha ao processar o extrato. Tente novamente.",
		})
	})

	it("should return specific error when AI throws 404", async () => {
		const mockCategories = { docs: [] }
		const mockExistingTransactions = { forEach: vi.fn() }
		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)
		mockGenerateContent.mockRejectedValue(new Error("404 Not Found"))
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error:
				"Modelo de IA não encontrado. Verifique se a API Key tem permissão.",
		})
	})

	it("should return error when AI returns no text", async () => {
		const mockCategories = { docs: [] }
		const mockExistingTransactions = { forEach: vi.fn() }
		const collectionMock = vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
			get: vi
				.fn()
				.mockResolvedValueOnce(mockCategories)
				.mockResolvedValueOnce(mockExistingTransactions),
		})
		;(dbAdmin.collection as any).mockImplementation(collectionMock)
		mockGenerateContent.mockResolvedValue({ text: "" })
		const formData = new FormData()
		const mockFile = new File(["content"], "test.pdf", {
			type: "application/pdf",
		})
		Object.defineProperty(mockFile, "arrayBuffer", {
			value: vi.fn().mockResolvedValue(Buffer.from("content").buffer),
		})
		formData.append("file", mockFile)
		const result = await scanBankStatement(formData)
		expect(result).toEqual({
			success: false,
			error: "Falha ao processar o extrato. Tente novamente.",
		})
	})
})
