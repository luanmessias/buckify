import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { CategoryManager } from "@/components/category/category-manager/category-manager"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"

interface CategoryPageProps {
	params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { id } = await params
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		notFound()
	}

	return (
		<ApolloWrapper>
			<CategoryManager categoryId={id} householdId={householdId} />
		</ApolloWrapper>
	)
}
