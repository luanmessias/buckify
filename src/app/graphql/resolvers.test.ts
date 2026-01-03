import { beforeEach, describe, expect, it, vi } from "vitest"
import { dbAdmin } from "@/lib/firebase-admin"
import { resolvers } from "./resolvers"

// Mock firebase-admin
vi.mock("@/lib/firebase-admin", () => {
	const collectionMock = {
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		get: vi.fn(),
		doc: vi.fn(),
	}

	const batchMock = {
		set: vi.fn(),
		commit: vi.fn(),
	}

	return {
		dbAdmin: {
			collection: vi.fn(() => collectionMock),
			batch: vi.fn(() => batchMock),
		},
	}
})

describe("GraphQL Resolvers", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("Query", () => {
		describe("getTransactions", () => {
			it("should fetch transactions filtered by householdId", async () => {
				const mockDocs = [
					{
						id: "1",
						data: () => ({ amount: 100, householdId: "h1", createdAt: 123 }),
					},
					{
						id: "2",
						data: () => ({ amount: 200, householdId: "h1", createdAt: 456 }),
					},
				]

				const collectionMock = dbAdmin.collection("transactions")
				;(collectionMock.get as any).mockResolvedValue({ docs: mockDocs })

				const result = await resolvers.Query.getTransactions(null, {
					startDate: "",
					endDate: "",
					householdId: "h1",
				})

				expect(dbAdmin.collection).toHaveBeenCalledWith("transactions")
				expect(collectionMock.where).toHaveBeenCalledWith(
					"householdId",
					"==",
					"h1",
				)
				expect(result).toHaveLength(2)
				expect(result[0]).toEqual({
					id: "1",
					amount: 100,
					householdId: "h1",
					createdAt: 123,
				})
			})

			it("should filter by categoryId and date range", async () => {
				const collectionMock = dbAdmin.collection("transactions")
				;(collectionMock.get as any).mockResolvedValue({ docs: [] })

				await resolvers.Query.getTransactions(null, {
					startDate: "2024-01-01",
					endDate: "2024-01-31",
					householdId: "h1",
					categoryId: "cat1",
				})

				expect(collectionMock.where).toHaveBeenCalledWith(
					"householdId",
					"==",
					"h1",
				)
				expect(collectionMock.where).toHaveBeenCalledWith(
					"categoryId",
					"==",
					"cat1",
				)
				expect(collectionMock.where).toHaveBeenCalledWith(
					"date",
					">=",
					"2024-01-01",
				)
				expect(collectionMock.where).toHaveBeenCalledWith(
					"date",
					"<=",
					"2024-01-31",
				)
				expect(collectionMock.orderBy).toHaveBeenCalledWith("date", "desc")
			})
		})

		describe("getCategories", () => {
			it("should fetch categories filtered by householdId", async () => {
				const mockDocs = [
					{ id: "c1", data: () => ({ name: "Food", householdId: "h1" }) },
				]

				const collectionMock = dbAdmin.collection("categories")
				;(collectionMock.get as any).mockResolvedValue({ docs: mockDocs })

				const result = await resolvers.Query.getCategories(null, {
					householdId: "h1",
				})

				expect(dbAdmin.collection).toHaveBeenCalledWith("categories")
				expect(collectionMock.where).toHaveBeenCalledWith(
					"householdId",
					"==",
					"h1",
				)
				expect(result).toHaveLength(1)
				expect(result[0].id).toBe("c1")
			})
		})

		describe("getCategory", () => {
			it("should return a single category", async () => {
				const mockDoc = {
					exists: true,
					id: "c1",
					data: () => ({ name: "Food", householdId: "h1" }),
				}

				const docMock = {
					get: vi.fn().mockResolvedValue(mockDoc),
				}

				const collectionMock = dbAdmin.collection("categories")
				;(collectionMock.doc as any).mockReturnValue(docMock)

				const result = await resolvers.Query.getCategory(null, {
					id: "c1",
					householdId: "h1",
				})

				expect(collectionMock.doc).toHaveBeenCalledWith("c1")
				expect(result).toEqual({ id: "c1", name: "Food", householdId: "h1" })
			})

			it("should throw error if category not found", async () => {
				const mockDoc = { exists: false }
				const docMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(docMock)

				await expect(
					resolvers.Query.getCategory(null, { id: "c1", householdId: "h1" }),
				).rejects.toThrow("Category not found")
			})

			it("should throw error if unauthorized", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ name: "Food", householdId: "other_household" }),
				}
				const docMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(docMock)

				await expect(
					resolvers.Query.getCategory(null, { id: "c1", householdId: "h1" }),
				).rejects.toThrow("Unauthorized")
			})
		})
	})

	describe("Mutation", () => {
		describe("createManyTransactions", () => {
			it("should create multiple transactions using batch", async () => {
				const transactions = [
					{
						date: "2024-01-01",
						description: "T1",
						amount: 10,
						categoryId: "c1",
					},
					{
						date: "2024-01-02",
						description: "T2",
						amount: 20,
						categoryId: "c1",
					},
				]

				const batchMock = dbAdmin.batch()
				const collectionMock = dbAdmin.collection("transactions")
				const docRefMock = { id: "new_id" }
				;(collectionMock.doc as any).mockReturnValue(docRefMock)

				const result = await resolvers.Mutation.createManyTransactions(null, {
					householdId: "h1",
					transactions,
				})

				expect(dbAdmin.batch).toHaveBeenCalled()
				expect(collectionMock.doc).toHaveBeenCalledTimes(2)
				expect(batchMock.set).toHaveBeenCalledTimes(2)
				expect(batchMock.commit).toHaveBeenCalled()
				expect(result).toEqual({
					success: true,
					message: "2 transações importadas!",
				})
			})

			it("should return error if no transactions provided", async () => {
				const result = await resolvers.Mutation.createManyTransactions(null, {
					householdId: "h1",
					transactions: [],
				})
				expect(result.success).toBe(false)
			})

			it("should handle errors gracefully", async () => {
				const batchMock = dbAdmin.batch()
				;(batchMock.commit as any).mockRejectedValue(new Error("Batch error"))

				const result = await resolvers.Mutation.createManyTransactions(null, {
					householdId: "h1",
					transactions: [
						{ date: "2024", description: "T", amount: 1, categoryId: "c" },
					],
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Erro interno ao salvar.")
			})
		})

		describe("updateCategory", () => {
			it("should update category successfully", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "h1" }),
				}
				const docRefMock = {
					get: vi.fn().mockResolvedValue(mockDoc),
					update: vi.fn().mockResolvedValue(undefined),
				}
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateCategory(null, {
					id: "c1",
					householdId: "h1",
					input: { name: "Updated Name" },
				})

				expect(docRefMock.update).toHaveBeenCalledWith({ name: "Updated Name" })
				expect(result.success).toBe(true)
			})

			it("should return error if category not found", async () => {
				const mockDoc = { exists: false }
				const docRefMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateCategory(null, {
					id: "c1",
					householdId: "h1",
					input: {},
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Category not found")
			})

			it("should return error if unauthorized", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "other" }),
				}
				const docRefMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateCategory(null, {
					id: "c1",
					householdId: "h1",
					input: {},
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Unauthorized")
			})

			it("should handle update errors", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "h1" }),
				}
				const docRefMock = {
					get: vi.fn().mockResolvedValue(mockDoc),
					update: vi.fn().mockRejectedValue(new Error("Update failed")),
				}
				;(dbAdmin.collection("categories").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateCategory(null, {
					id: "c1",
					householdId: "h1",
					input: { name: "Test" },
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Error updating category")
			})
		})

		describe("updateTransaction", () => {
			it("should update transaction successfully", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "h1" }),
				}
				const docRefMock = {
					get: vi.fn().mockResolvedValue(mockDoc),
					update: vi.fn().mockResolvedValue(undefined),
				}
				;(dbAdmin.collection("transactions").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateTransaction(null, {
					id: "t1",
					householdId: "h1",
					input: { amount: 500 },
				})

				expect(docRefMock.update).toHaveBeenCalledWith({ amount: 500 })
				expect(result.success).toBe(true)
			})

			it("should return error if transaction not found", async () => {
				const mockDoc = { exists: false }
				const docRefMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("transactions").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateTransaction(null, {
					id: "t1",
					householdId: "h1",
					input: {},
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Transaction not found")
			})

			it("should return error if unauthorized", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "other" }),
				}
				const docRefMock = { get: vi.fn().mockResolvedValue(mockDoc) }
				;(dbAdmin.collection("transactions").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateTransaction(null, {
					id: "t1",
					householdId: "h1",
					input: {},
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Unauthorized")
			})

			it("should handle update errors", async () => {
				const mockDoc = {
					exists: true,
					data: () => ({ householdId: "h1" }),
				}
				const docRefMock = {
					get: vi.fn().mockResolvedValue(mockDoc),
					update: vi.fn().mockRejectedValue(new Error("Update failed")),
				}
				;(dbAdmin.collection("transactions").doc as any).mockReturnValue(
					docRefMock,
				)

				const result = await resolvers.Mutation.updateTransaction(null, {
					id: "t1",
					householdId: "h1",
					input: { amount: 100 },
				})

				expect(result.success).toBe(false)
				expect(result.message).toBe("Error updating transaction")
			})
		})
	})
})
