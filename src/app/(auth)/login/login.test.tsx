import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { createSession } from "@/app/actions/auth"
import messages from "@/messages/en.json"
import { AuthProvider } from "@/providers/auth-provider"
import LoginPage from "./page"

const { signInWithPopupMock, refreshMock, onAuthStateChangedMock } = vi.hoisted(
	() => {
		return {
			signInWithPopupMock: vi.fn(),
			refreshMock: vi.fn(),
			onAuthStateChangedMock: vi.fn(() => vi.fn()),
		}
	},
)

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		refresh: refreshMock,
	}),
}))

vi.mock("firebase/auth", () => ({
	getAuth: vi.fn(),
	GoogleAuthProvider: vi.fn(),
	signInWithPopup: signInWithPopupMock,
	signInWithRedirect: vi.fn(),
	getRedirectResult: vi.fn().mockResolvedValue(null),
	onAuthStateChanged: onAuthStateChangedMock,
}))

vi.mock("@/lib/firebase", () => ({
	auth: {},
	googleProvider: {},
}))

vi.mock("@/app/actions/auth", () => ({
	createSession: vi.fn(),
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}))

const renderWithProviders = (ui: React.ReactElement) => {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<AuthProvider>{ui}</AuthProvider>
		</NextIntlClientProvider>,
	)
}

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		sessionStorage.clear()
	})

	it("should render the login button with google", () => {
		renderWithProviders(<LoginPage />)
		expect(
			screen.getByRole("button", { name: "google_button" }),
		).toBeInTheDocument()
	})

	it("should call createSession and refresh router on successful login", async () => {
		const mockUser = {
			uid: "123",
			email: "teste@teste.com",
			getIdToken: vi.fn().mockResolvedValue("mock-id-token"),
		}

		;(onAuthStateChangedMock as Mock).mockImplementation(
			(_auth: unknown, callback: (user: unknown) => void) => {
				callback(mockUser)
				return vi.fn()
			},
		)

		;(createSession as Mock).mockResolvedValue(true)

		renderWithProviders(<LoginPage />)

		await waitFor(() => {
			expect(createSession).toHaveBeenCalledWith("mock-id-token")
		})

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith("success_toast")
		})

		await waitFor(() => {
			expect(refreshMock).toHaveBeenCalled()
		})
	})

	it("should display the toast error if login fails", async () => {
		const user = userEvent.setup()
		renderWithProviders(<LoginPage />)

		signInWithPopupMock.mockRejectedValueOnce({
			code: "auth/popup-closed-by-user",
		})

		const button = screen.getByRole("button", {
			name: "google_button",
		})

		await user.click(button)

		await waitFor(() => {
			expect(button).not.toBeDisabled()
			expect(toast.error).not.toHaveBeenCalled()
		})
	})

	it("should display the toast error for network failure", async () => {
		const user = userEvent.setup()
		renderWithProviders(<LoginPage />)

		signInWithPopupMock.mockRejectedValueOnce(new Error("Network error"))

		const button = screen.getByRole("button", {
			name: "google_button",
		})

		await user.click(button)

		await waitFor(() => {
			expect(button).not.toBeDisabled()
			expect(toast.error).toHaveBeenCalledWith("login_error")
		})
	})
})
