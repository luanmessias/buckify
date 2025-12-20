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
	description: string
	budget: number
	color: string
	icon: string
}
