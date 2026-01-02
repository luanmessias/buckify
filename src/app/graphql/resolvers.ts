import type { Query } from "firebase-admin/firestore"
import { dbAdmin } from "@/lib/firebase-admin"

interface GetTransactionsArgs {
	startDate: string
	endDate: string
	householdId: string
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

export const resolvers = {
	Query: {
		getTransactions: async (
			_: unknown,
			{ startDate, endDate, householdId }: GetTransactionsArgs,
		) => {
			let query: Query = dbAdmin.collection("transactions")

			if (startDate && endDate && householdId) {
				query = query
					.where("householdId", "==", householdId)
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
			let query: Query = dbAdmin.collection("category")

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
	},
}
