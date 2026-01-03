export type Transaction = {
	id: string
	description: string
	amount: number
	categoryId: string
	date: string
}

export type Category = {
	id: string
	householdId: string
	name: string
	slug: string
	description: string
	budget: number
	color: string
	icon: string
}

export type ScannedTransaction = Omit<Transaction, "id"> & {
	isPossibleDuplicate?: boolean
}
