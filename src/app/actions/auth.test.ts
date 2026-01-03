import { cookies } from "next/headers"
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { authAdmin, dbAdmin } from "@/lib/firebase-admin"
import { createSession, logout } from "./auth"

// Mock next/headers
vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}))

// Mock firebase-admin
vi.mock("@/lib/firebase-admin", () => {
	const collectionMock = {
		doc: vi.fn(),
	}

	return {
		authAdmin: {
			verifyIdToken: vi.fn(),
			createSessionCookie: vi.fn(),
		},
		dbAdmin: {
			collection: vi.fn(() => collectionMock),
		},
	}
})

vi.mock("@/lib/auth-constants", () => ({
	isProduction: vi.fn(() => false),
	SESSION_DURATION: 60 * 60 * 24 * 5 * 1000,
}))

describe("Auth Actions", () => {
	let cookieStoreMock: any

	beforeEach(() => {
		vi.clearAllMocks()
		cookieStoreMock = {
			set: vi.fn(),
			delete: vi.fn(),
		}
		;(cookies as unknown as Mock).mockReturnValue(cookieStoreMock)
	})

	describe("createSession", () => {
		it("should create a session for a new user", async () => {
			// Mock authAdmin.verifyIdToken
			const decodedToken = {
				uid: "user123",
				email: "test@example.com",
				name: "Test User",
				picture: "http://example.com/pic.jpg",
			}
			;(authAdmin.verifyIdToken as Mock).mockResolvedValue(decodedToken)

			// Mock user lookup (not found)
			const userDocMock = {
				get: vi.fn().mockResolvedValue({ exists: false }),
				set: vi.fn(),
			}

			// Mock household creation
			const householdDocMock = {
				set: vi.fn(),
			}

			const usersCollectionMock = {
				doc: vi.fn().mockReturnValue(userDocMock),
			}
			const householdsCollectionMock = {
				doc: vi.fn().mockReturnValue(householdDocMock),
			}

			;(dbAdmin.collection as Mock).mockImplementation((name) => {
				if (name === "users") return usersCollectionMock
				if (name === "households") return householdsCollectionMock
				return { doc: vi.fn() }
			})

			// Mock session cookie creation
			;(authAdmin.createSessionCookie as Mock).mockResolvedValue(
				"session-cookie",
			)

			const result = await createSession("valid-id-token")

			expect(authAdmin.verifyIdToken).toHaveBeenCalledWith(
				"valid-id-token",
				true,
			)

			// Should create household
			expect(householdsCollectionMock.doc).toHaveBeenCalled()
			expect(householdDocMock.set).toHaveBeenCalledWith(
				expect.objectContaining({
					ownerId: "user123",
					members: ["user123"],
				}),
			)

			// Should create user
			expect(usersCollectionMock.doc).toHaveBeenCalledWith("user123")
			expect(userDocMock.set).toHaveBeenCalledWith(
				expect.objectContaining({
					uid: "user123",
					email: "test@example.com",
					currentHouseholdId: expect.stringMatching(/^family_test_user123$/),
				}),
			)

			// Should set cookies
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				"__session",
				"session-cookie",
				expect.any(Object),
			)
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				"householdId",
				expect.stringMatching(/^family_test_user123$/),
				expect.any(Object),
			)

			expect(result).toEqual({ success: true })
		})

		it("should create a session for an existing user", async () => {
			// Mock authAdmin.verifyIdToken
			const decodedToken = {
				uid: "user123",
				email: "test@example.com",
				name: "Test User",
				picture: "http://example.com/pic.jpg",
			}
			;(authAdmin.verifyIdToken as Mock).mockResolvedValue(decodedToken)

			// Mock user lookup (found)
			const userDocMock = {
				get: vi.fn().mockResolvedValue({
					exists: true,
					data: () => ({ currentHouseholdId: "existing_household_id" }),
				}),
			}

			const usersCollectionMock = {
				doc: vi.fn().mockReturnValue(userDocMock),
			}

			;(dbAdmin.collection as Mock).mockImplementation((name) => {
				if (name === "users") return usersCollectionMock
				return { doc: vi.fn() }
			})

			// Mock session cookie creation
			;(authAdmin.createSessionCookie as Mock).mockResolvedValue(
				"session-cookie",
			)

			const result = await createSession("valid-id-token")

			// Should set cookies with existing householdId
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				"householdId",
				"existing_household_id",
				expect.any(Object),
			)

			expect(result).toEqual({ success: true })
		})

		it("should throw error if email is missing", async () => {
			;(authAdmin.verifyIdToken as Mock).mockResolvedValue({ uid: "123" }) // No email

			await expect(createSession("token")).rejects.toThrow(
				"Email não fornecido pelo Google",
			)
		})

		it("should handle errors", async () => {
			;(authAdmin.verifyIdToken as Mock).mockRejectedValue(
				new Error("Auth error"),
			)

			// Mock console.error to avoid noise
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

			await expect(createSession("token")).rejects.toThrow("Auth error")

			consoleSpy.mockRestore()
		})
	})

	describe("logout", () => {
		it("should delete session cookies", async () => {
			await logout()

			expect(cookieStoreMock.delete).toHaveBeenCalledWith("__session")
			expect(cookieStoreMock.delete).toHaveBeenCalledWith("householdId")
		})
	})
})
