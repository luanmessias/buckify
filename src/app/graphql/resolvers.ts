import type { Query } from "firebase-admin/firestore"
import { dbAdmin } from "@/lib/firebase-admin"

interface GetTransactionsArgs {
	startDate: string
	endDate: string
	householdId: string
	categoryId?: string
}

interface GetCategoriesArgs {
	householdId: string
}

interface CreateTransactionInput {
	date: string
	description: string
	amount: number
	categoryId: string
}

interface UpdateCategoryInput {
	name?: string
	description?: string
	budget?: number
	color?: string
	icon?: string
}

interface UpdateTransactionInput {
	date?: string
	description?: string
	amount?: number
	categoryId?: string
}

export const resolvers = {
	Query: {
		getTransactions: async (
			_: unknown,
			{ startDate, endDate, householdId, categoryId }: GetTransactionsArgs,
		) => {
			let query: Query = dbAdmin.collection("transactions")

			if (householdId) {
				query = query.where("householdId", "==", householdId)
			}

			if (categoryId) {
				query = query.where("categoryId", "==", categoryId)
			}

			if (startDate && endDate) {
				query = query
					.where("date", ">=", startDate)
					.where("date", "<=", endDate)
					.orderBy("date", "desc")
			}

			const snapshot = await query.get()

			return snapshot.docs.map((doc) => {
				const data = doc.data()
				return {
					id: doc.id,
					...data,
					createdAt: data.createdAt,
				}
			})
		},

		getCategories: async (_: unknown, { householdId }: GetCategoriesArgs) => {
			let query: Query = dbAdmin.collection("categories")

			if (householdId) {
				query = query.where("householdId", "==", householdId)
			}

			const snapshot = await query.get()

			return snapshot.docs.map((doc) => {
				const data = doc.data()
				return {
					id: doc.id,
					...data,
					createdAt: data.createdAt,
				}
			})
		},

		getCategory: async (
			_: unknown,
			{ id, householdId }: { id: string; householdId: string },
		) => {
			const doc = await dbAdmin.collection("categories").doc(id).get()

			if (!doc.exists) {
				throw new Error("Category not found")
			}

			const data = doc.data()

			if (data?.householdId !== householdId) {
				throw new Error("Unauthorized")
			}

			return {
				id: doc.id,
				...data,
			}
		},

		getShoppingHistory: async () => {
			const snapshot = await dbAdmin.collection("shopping_history").get()
			return snapshot.docs.map((doc) => {
				const data = doc.data()

				return {
					id: doc.id,
					...data,
				}
			})
		},

		getWishlist: async () => {
			const snapshot = await dbAdmin.collection("wishlist").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},

		getProductCatalog: async () => {
			const snapshot = await dbAdmin.collection("product_catalog").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},

		getShoppingList: async () => {
			const snapshot = await dbAdmin.collection("shopping_list").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},
	},
	Mutation: {
		createManyTransactions: async (
			_: unknown,
			{
				householdId,
				transactions,
			}: { householdId: string; transactions: CreateTransactionInput[] },
		) => {
			try {
				if (!transactions || transactions.length === 0) {
					return { success: false, message: "Nenhuma transação enviada." }
				}

				const batch = dbAdmin.batch()
				const collectionRef = dbAdmin.collection("transactions")

				transactions.forEach((txn) => {
					const docRef = collectionRef.doc()

					batch.set(docRef, {
						...txn,
						householdId,
						createdAt: Date.now(),
						type: "expense",
					})
				})

				await batch.commit()

				return {
					success: true,
					message: `${transactions.length} transações importadas!`,
				}
			} catch (error) {
				console.error("Erro ao salvar lote:", error)
				return { success: false, message: "Erro interno ao salvar." }
			}
		},

		updateCategory: async (
			_: unknown,
			{
				id,
				householdId,
				input,
			}: { id: string; householdId: string; input: UpdateCategoryInput },
		) => {
			try {
				const docRef = dbAdmin.collection("categories").doc(id)
				const doc = await docRef.get()

				if (!doc.exists) {
					return { success: false, message: "Category not found" }
				}

				const data = doc.data()
				if (data?.householdId !== householdId) {
					return { success: false, message: "Unauthorized" }
				}

				const updateData: Record<string, string | number> = {}
				Object.entries(input).forEach(([key, value]) => {
					if (value !== undefined) {
						updateData[key] = value
					}
				})

				await docRef.update(updateData)

				return { success: true, message: "Category updated successfully" }
			} catch (error) {
				console.error("Update category error:", error)
				return { success: false, message: "Error updating category" }
			}
		},

		updateTransaction: async (
			_: unknown,
			{
				id,
				householdId,
				input,
			}: { id: string; householdId: string; input: UpdateTransactionInput },
		) => {
			try {
				const docRef = dbAdmin.collection("transactions").doc(id)
				const doc = await docRef.get()

				if (!doc.exists) {
					return { success: false, message: "Transaction not found" }
				}

				const data = doc.data()
				if (data?.householdId !== householdId) {
					return { success: false, message: "Unauthorized" }
				}

				const updateData: Record<string, string | number> = {}
				Object.entries(input).forEach(([key, value]) => {
					if (value !== undefined) {
						updateData[key] = value
					}
				})

				await docRef.update(updateData)

				return { success: true, message: "Transaction updated successfully" }
			} catch (error) {
				console.error("Update transaction error:", error)
				return { success: false, message: "Error updating transaction" }
			}
		},
	},
}
