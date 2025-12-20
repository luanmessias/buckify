import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createSession } from "@/app/actions/auth"
import messages from "@/messages/en.json"
import LoginPage from "./page"

const { signInMock, pushMock } = vi.hoisted(() => {
	return {
		signInMock: vi.fn(),
		pushMock: vi.fn(),
		createSessionMock: vi.fn(),
	}
})

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}))

vi.mock("firebase/auth", () => ({
	getAuth: vi.fn(),
	GoogleAuthProvider: vi.fn(),
	signInWithPopup: signInMock,
}))

vi.mock("@/lib/firebase", () => ({
	auth: {},
	googleProvider: {},
}))

vi.mock("@/app/actions/auth", () => ({
	createSession: vi.fn().mockResolvedValue(true),
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}))

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render the login button with google", () => {
		render(<LoginPage />)

		expect(screen.getByText(messages.Auth.google_button)).toBeInTheDocument()
	})

	it("should call the signInWithPopup and redirect when clicked", async () => {
		const user = userEvent.setup()
		render(<LoginPage />)

		signInMock.mockImplementationOnce(() => {
			return new Promise((resolve) =>
				setTimeout(
					() =>
						resolve({
							user: {
								uid: "123",
								email: "teste@teste.com",
								getIdToken: vi.fn().mockResolvedValue("123"),
							},
						}),
					100,
				),
			)
		})

		const button = screen.getByRole("button", {
			name: messages.Auth.google_button,
		})

		await user.click(button)

		expect(button).toBeDisabled()
		expect(screen.getByText(messages.Auth.connecting)).toBeInTheDocument()

		await waitFor(() => {
			expect(signInMock).toHaveBeenCalled()
			expect(createSession).toHaveBeenCalledWith("123")
			expect(toast.success).toHaveBeenCalledWith(messages.Auth.success_toast, {
				description: messages.Auth.redirecting,
			})
		})
	})

	it("should display the toast error if login fails", async () => {
		const user = userEvent.setup()
		render(<LoginPage />)

		signInMock.mockRejectedValueOnce(new Error("Popup closed"))

		const button = screen.getByRole("button", {
			name: messages.Auth.google_button,
		})

		await user.click(button)

		await waitFor(() => {
			expect(screen.getByText(messages.Auth.google_button)).toBeInTheDocument()
			expect(button).not.toBeDisabled()
			expect(toast.error).toHaveBeenCalledWith(messages.Auth.error_title, {
				description: messages.Auth.error_description,
				action: expect.objectContaining({ label: messages.Auth.retry }),
			})
			expect(pushMock).not.toHaveBeenCalled()
		})
	})

	it("should display the toast error for network failure", async () => {
		const user = userEvent.setup()
		render(<LoginPage />)

		signInMock.mockRejectedValueOnce(new Error("Network error"))

		const button = screen.getByRole("button", {
			name: messages.Auth.google_button,
		})

		await user.click(button)

		await waitFor(() => {
			expect(screen.getByText(messages.Auth.google_button)).toBeInTheDocument()
			expect(button).not.toBeDisabled()
			expect(toast.error).toHaveBeenCalledWith(messages.Auth.error_title, {
				description: messages.Auth.error_description,
				action: expect.objectContaining({ label: messages.Auth.retry }),
			})
			expect(pushMock).not.toHaveBeenCalled()
		})
	})
})
