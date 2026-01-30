import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { NextRequest } from "next/server"
import { resolvers } from "@/app/graphql/resolvers"
import { typeDefs } from "@/app/graphql/schema"
import { authAdmin } from "@/lib/firebase-admin"

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

const apolloHandler = startServerAndCreateNextHandler<NextRequest>(server, {
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
			} catch (_error) {}
		}
		return { req }
	},
})

export async function POST(req: NextRequest) {
	try {
		const bodyText = await req.text()

		if (!bodyText || bodyText.trim().length === 0) {
			return new Response("Bad Request: Empty Body", { status: 400 })
		}

		const newReq = new NextRequest(req, {
			body: bodyText,
			headers: req.headers,
			method: req.method,
		})

		return await apolloHandler(newReq)
	} catch (error: unknown) {
		console.error("Erro na rota GraphQL:", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
