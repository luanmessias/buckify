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

export type Household = {
	id: string
	name: string
	ownerId: string
	members: string[]
	createdAt: number
	budget?: number
	currency?: string
}
