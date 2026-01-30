export const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000

export const isLocalhost = () =>
	typeof window !== "undefined" &&
	(window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1")

export const isProduction = () => process.env.NODE_ENV === "production"

export const isTestEnvironment = () =>
	process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === "true"
