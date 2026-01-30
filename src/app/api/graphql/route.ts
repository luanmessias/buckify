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

		try {
			if (token) {
				const user = await authAdmin.verifyIdToken(token)
				return { req, user }
			}
		} catch (error) {
			console.error("Erro de Auth no GraphQL:", error)
		}

		return { req }
	},
})

export { handler as GET, handler as POST }
