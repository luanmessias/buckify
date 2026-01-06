import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { signOut } from "firebase/auth"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"
import { logout } from "@/app/actions/auth"
import messages from "@/messages/en.json"
import { LogoutButton } from "./logout-button"

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		refresh: vi.fn(),
	}),
}))

vi.mock("firebase/auth", () => ({
	getAuth: vi.fn(),
	signOut: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
	auth: {},
}))

vi.mock("@/app/actions/auth", () => ({
	logout: vi.fn(),
}))

describe("LogoutButton", () => {
	it("should render the logout button", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<LogoutButton />
			</NextIntlClientProvider>,
		)
		expect(screen.getByRole("button")).toBeInTheDocument()
	})

	it("should call logout functions on click", async () => {
		const user = userEvent.setup()
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<LogoutButton />
			</NextIntlClientProvider>,
		)

		await user.click(screen.getByRole("button"))

		await waitFor(() => {
			expect(signOut).toHaveBeenCalled()
			expect(logout).toHaveBeenCalled()
		})
	})
})
