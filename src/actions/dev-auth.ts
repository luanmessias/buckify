"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isProduction, isTestEnvironment } from "@/lib/auth-constants"

export async function devLogin() {
	if (isProduction() && !isTestEnvironment()) {
		const error = new Error("Dev login not allowed in production")
		console.error(
			"Security violation: Attempted dev login in production",
			error,
		)
		throw error
	}

	const householdId = process.env.DEV_HOUSEHOLD_ID

	if (!householdId) {
		throw new Error("Faltou o DEV_HOUSEHOLD_ID no .env")
	}

	const cookieStore = await cookies()

	cookieStore.set("householdId", householdId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
	})

	cookieStore.set("__session", "dev_session_bypassed", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
	})

	redirect("/")
}
