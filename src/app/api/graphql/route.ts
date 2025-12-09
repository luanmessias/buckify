import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import type { NextRequest } from "next/server"
import { resolvers } from "@/app/graphql/resolvers"
import { typeDefs } from "@/app/graphql/schema"

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context: async (req) => ({ req }),
})

export { handler as GET, handler as POST }
