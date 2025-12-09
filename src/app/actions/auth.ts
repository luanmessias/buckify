"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const createSession = (uid: string) => {
	cookies().set("buckify_session", uid, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60 * 24 * 7,
	})
}

export const removeSession = () => {
	cookies().delete("buckify_session")
	redirect("/login")
}
