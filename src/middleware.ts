import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const middleware = (request: NextRequest) => {
	const session = request.cookies.get("buckify_session")?.value
	const isAuthPage = request.nextUrl.pathname.startsWith("/login")
	const isDashboardPage =
		request.nextUrl.pathname === "/" ||
		request.nextUrl.pathname.startsWith("/transactions")

	if (!session && isDashboardPage) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	if (session && isAuthPage) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
