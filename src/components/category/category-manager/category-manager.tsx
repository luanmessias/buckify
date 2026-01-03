"use client"

interface CategoryManagerProps {
	categoryId: string
	householdId: string
}

export const CategoryManager = ({
	categoryId,
	householdId,
}: CategoryManagerProps) => {
	return (
		<div>
			<h1>{categoryId}</h1>
			<h1>{householdId}</h1>
		</div>
	)
}
