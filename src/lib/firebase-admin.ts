import "server-only"
import * as admin from "firebase-admin"

interface FirebaseAdminConfig {
	projectId: string
	clientEmail: string
	privateKey: string
}

const projectId = process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID
const clientEmail = process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL
const privateKey = process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY

if (!projectId || !clientEmail || !privateKey) {
	throw new Error(
		"Critical Error: Firebase Admin environment variables not found. Check your .env.local",
	)
}

const formatPrivateKey = (key: string) => {
	return key.replace(/\\n/g, "\n")
}

export const createFirebaseAdminApp = (config: FirebaseAdminConfig) => {
	if (admin.apps.length > 0) {
		return admin.app()
	}

	return admin.initializeApp({
		credential: admin.credential.cert({
			projectId: config.projectId,
			clientEmail: config.clientEmail,
			privateKey: formatPrivateKey(config.privateKey),
		}),
	})
}

const adminApp = createFirebaseAdminApp({
	projectId,
	clientEmail,
	privateKey,
})

export const dbAdmin = adminApp.firestore()
