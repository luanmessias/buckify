import { dbAdmin } from "@/lib/firebase-admin"

export const resolvers = {
	Query: {
		// 1. Transações
		getTransactions: async () => {
			const snapshot = await dbAdmin.collection("transactions").get()
			return snapshot.docs.map((doc) => {
				const data = doc.data()
				return {
					id: doc.id,
					...data,
					// Caso precise converter timestamp para número puro se vier como objeto
					createdAt: data.createdAt,
				}
			})
		},

		// 2. Histórico de Compras (Complexo)
		getShoppingHistory: async () => {
			const snapshot = await dbAdmin.collection("shopping_history").get()
			return snapshot.docs.map((doc) => {
				const data = doc.data()

				// O campo 'items' no Firestore já é um array de mapas,
				// o que mapeia direto para [ShoppingItem] no GraphQL.
				return {
					id: doc.id,
					...data,
				}
			})
		},

		// 3. Wishlist
		getWishlist: async () => {
			const snapshot = await dbAdmin.collection("wishlist").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},

		// 4. Catálogo de Produtos
		getProductCatalog: async () => {
			const snapshot = await dbAdmin.collection("product_catalog").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},

		// 5. Lista de Compras Atual
		getShoppingList: async () => {
			const snapshot = await dbAdmin.collection("shopping_list").get()
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		},
	},
}
