import { dbAdmin } from "@/lib/firebase-admin"

interface DeleteCategoryInput {
	id: string
	householdId: string
	transferToCategoryId?: string | null
}

interface OperationResult {
	success: boolean
	message: string
}

const MAX_TRANSACTION_LIMIT = 450

export const deleteCategory = async ({
	id,
	householdId,
	transferToCategoryId,
}: DeleteCategoryInput): Promise<OperationResult> => {
	try {
		const transactionsRef = dbAdmin.collection("transactions")
		const transactionCountSnapshot = await transactionsRef
			.where("categoryId", "==", id)
			.count()
			.get()

		if (transactionCountSnapshot.data().count > MAX_TRANSACTION_LIMIT) {
			return {
				success: false,
				message:
					"Too many transactions to delete at once. Please delete some manually first.",
			}
		}

		return await dbAdmin.runTransaction(async (t) => {
			const categoryRef = dbAdmin.collection("categories").doc(id)
			const categoryDoc = await t.get(categoryRef)

			if (!categoryDoc.exists) {
				return { success: false, message: "Category not found" }
			}

			const categoryData = categoryDoc.data()
			if (categoryData?.householdId !== householdId) {
				return { success: false, message: "Unauthorized" }
			}

			let targetCategoryId: string | null = null

			if (transferToCategoryId) {
				const targetCategoryRef = dbAdmin
					.collection("categories")
					.doc(transferToCategoryId)
				const targetCategoryDoc = await t.get(targetCategoryRef)

				if (!targetCategoryDoc.exists) {
					const slugSnapshot = await t.get(
						dbAdmin
							.collection("categories")
							.where("householdId", "==", householdId)
							.where("slug", "==", transferToCategoryId)
							.limit(1),
					)

					if (!slugSnapshot.empty) {
						targetCategoryId = slugSnapshot.docs[0].id
					} else {
						return { success: false, message: "Target category not found" }
					}
				} else {
					if (targetCategoryDoc.data()?.householdId !== householdId) {
						return { success: false, message: "Target category unauthorized" }
					}
					targetCategoryId = targetCategoryDoc.id
				}
			}

			const transactionsSnapshot = await t.get(
				transactionsRef.where("categoryId", "==", id),
			)

			transactionsSnapshot.docs.forEach((doc) => {
				if (targetCategoryId) {
					t.update(doc.ref, { categoryId: targetCategoryId })
				} else {
					t.delete(doc.ref)
				}
			})

			t.delete(categoryRef)

			return { success: true, message: "Category deleted successfully" }
		})
	} catch (error) {
		console.error("Error deleting category:", error)
		return { success: false, message: "Error deleting category" }
	}
}
