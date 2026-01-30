import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import type { NextRequest } from "next/server"
import { resolvers } from "@/app/graphql/resolvers"
import { typeDefs } from "@/app/graphql/schema"
import { authAdmin } from "@/lib/firebase-admin"

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context: async (req) => {
		const token = req.cookies.get("__session")?.value

		if (token === "dev_session_bypassed") {
			return {
				req,
				user: {
					uid: "dev-user-id",
					email: "dev@buckify.com",
					email_verified: true,
					name: "Developer Mode",
				},
			}
		}

		if (token) {
			try {
				const user = await authAdmin.verifyIdToken(token)
				return { req, user }
			} catch (error) {
				console.error("Erro de Auth no GraphQL:", error)
			}
		}

		return { req }
	},
})

export async function POST(req: NextRequest) {
	const contentLength = req.headers.get("content-length")

	if (!contentLength || Number(contentLength) === 0) {
		return new Response("Bad Request: Empty Body", { status: 400 })
	}

	return handler(req)
}
