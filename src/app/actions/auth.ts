"use server"

import { cookies } from "next/headers"
import { isProduction, SESSION_DURATION } from "@/lib/auth-constants"
import { authAdmin, dbAdmin } from "@/lib/firebase-admin"

const generateHouseholdId = (userName: string, userId: string) => {
	const cleanName = userName
		.split(" ")[0]
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "")

	return `family_${cleanName}_${userId}`
}

export const createSession = async (idToken: string) => {
	try {
		const decodedToken = await authAdmin.verifyIdToken(idToken, true)
		const { uid, email, name, picture } = decodedToken

		if (!email) throw new Error("Email não fornecido pelo Google")

		const userRef = dbAdmin.collection("users").doc(uid)
		const userSnap = await userRef.get()
		let householdId = ""

		if (!userSnap.exists) {
			const customId = generateHouseholdId(name || "usuario", uid)
			await dbAdmin
				.collection("households")
				.doc(customId)
				.set({
					name: `Família de ${name?.split(" ")[0]}`,
					createdAt: new Date().toISOString(),
					ownerId: uid,
					members: [uid],
				})
			householdId = customId

			await userRef.set({
				uid,
				email,
				name,
				photoURL: picture,
				createdAt: new Date().toISOString(),
				currentHouseholdId: householdId,
			})
		} else {
			householdId = userSnap.data()?.currentHouseholdId
		}

		const sessionCookie = await authAdmin.createSessionCookie(idToken, {
			expiresIn: SESSION_DURATION,
		})

		cookies().set("__session", sessionCookie, {
			maxAge: SESSION_DURATION,
			httpOnly: true,
			secure: isProduction(),
			path: "/",
			sameSite: "lax",
		})

		cookies().set("householdId", householdId, {
			maxAge: SESSION_DURATION,
			httpOnly: true,
			secure: isProduction(),
			path: "/",
			sameSite: "lax",
		})

		return { success: true }
	} catch (error: unknown) {
		console.error("Auth Action Error:", error)
		throw error
	}
}

export async function logout() {
	cookies().delete("__session")
	cookies().delete("householdId")
}
