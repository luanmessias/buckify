"use client"

import { HttpLink } from "@apollo/client"
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
} from "@apollo/client-integration-nextjs"

function makeClient() {
	const uri =
		typeof window === "undefined"
			? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/graphql`
			: "/api/graphql"

	const httpLink = new HttpLink({
		uri: uri,
		fetchOptions: { cache: "no-store" },
	})

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	})
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	)
}
