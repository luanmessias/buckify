"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function devLogin() {
	if (process.env.NEXT_PUBLIC_DEV_MODE !== "true") return

	const householdId = process.env.DEV_HOUSEHOLD_ID

	if (!householdId) {
		throw new Error("Faltou o DEV_HOUSEHOLD_ID no .env")
	}

	cookies().set("householdId", householdId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
	})

	cookies().set("__session", "dev_session_bypassed", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
	})

	redirect("/")
}