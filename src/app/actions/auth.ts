"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authAdmin, dbAdmin } from "@/lib/firebase-admin"

const generateHouseholdId = (userName: string, userId: string) => {
	const cleanName = userName
		.split(" ")[0]
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "")

	return `family_${cleanName}_${userId}`
}

export const createSession = async (idToken: string) => {
	const decodedToken = await authAdmin.verifyIdToken(idToken)
	const { uid, email, name, picture } = decodedToken

	if (!email) throw new Error("Email não fornecido pelo Google")

	const userRef = dbAdmin.collection("users").doc(uid)
	const userSnap = await userRef.get()

	let householdId = ""

	if (!userSnap.exists) {
		console.log(`Novo usuário detectado: ${email}. Criando infraestrutura...`)

		const customId = generateHouseholdId(name || "usuario", uid)
		const newHouseholdRef = dbAdmin.collection("households").doc(customId)
		householdId = customId

		await newHouseholdRef.set({
			name: `Família de ${name?.split(" ")[0]}`,
			createdAt: new Date().toISOString(),
			ownerId: uid,
			members: [uid],
		})

		await userRef.set({
			uid,
			email,
			name,
			photoURL: picture,
			createdAt: new Date().toISOString(),
			currentHouseholdId: householdId,
		})
	} else {
		const userData = userSnap.data()
		householdId = userData?.currentHouseholdId

		if (!householdId) {
			throw new Error("Usuário sem vínculo familiar (Household ID missing).")
		}
	}

	const expiresIn = 60 * 60 * 24 * 5 * 1000
	const sessionCookie = await authAdmin.createSessionCookie(idToken, {
		expiresIn,
	})

	cookies().set("__session", sessionCookie, {
		maxAge: expiresIn,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
	})

	cookies().set("householdId", householdId, {
		maxAge: expiresIn,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
	})

	redirect("/")
}

export async function logout() {
	cookies().delete("__session")
	cookies().delete("householdId")
	redirect("/login")
}
