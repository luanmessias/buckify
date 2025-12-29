import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/static") ||
		pathname.startsWith("/__") ||
		pathname.includes(".")
	) {
		return NextResponse.next()
	}

	const session = request.cookies.get("__session")?.value
	const isAuthPage = pathname.startsWith("/login")
	const isDashboardPage =
		pathname === "/" || pathname.startsWith("/transactions")

	if (!session && isDashboardPage) {
		const loginUrl = new URL("/login", request.url)
		if (search) {
			loginUrl.search = search
		}
		return NextResponse.redirect(loginUrl)
	}

	if (session && isAuthPage) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|__).*)"],
}
