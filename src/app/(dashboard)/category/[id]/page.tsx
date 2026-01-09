import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CategoryView } from "@/components/category/category-view/category-view"
import { ApolloWrapper } from "@/components/providers/apollo-wrapper/apollo-wrapper"

import Loading from "./loading"

interface CategoryPageProps {
	params: Promise<{ id: string }>
	searchParams: Promise<{ month?: string }>
}

export default async function CategoryPage({
	params,
	searchParams,
}: CategoryPageProps) {
	const { id } = await params
	const { month } = await searchParams
	const householdId = cookies().get("householdId")?.value

	if (!householdId) {
		notFound()
	}

	const suspenseKey = `${id}-${month || "current"}`

	return (
		<ApolloWrapper>
			<Suspense key={suspenseKey} fallback={<Loading />}>
				<CategoryView categoryId={id} householdId={householdId} />
			</Suspense>
		</ApolloWrapper>
	)
}
