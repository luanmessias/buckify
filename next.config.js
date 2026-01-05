import path from "node:path"
import { fileURLToPath } from "node:url"
import createNextIntlPlugin from "next-intl/plugin"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const withNextIntl = createNextIntlPlugin()

const nextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	async rewrites() {
		return [
			{
				source: "/__/auth/:path*",
				destination: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com/__/auth/:path*`,
			},
		]
	},
}

export default withNextIntl(nextConfig)
