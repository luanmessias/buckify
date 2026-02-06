import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { UserSettings } from "./user-settings"

vi.mock("@apollo/client/react", () => ({
	useMutation: vi.fn(),
}))

vi.mock("react-redux", () => ({
	useDispatch: vi.fn(),
	useSelector: vi.fn(),
}))

vi.mock("@/lib/hooks", () => ({
	useAppDispatch: vi.fn(),
	useAppSelector: vi.fn(),
}))

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}))

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("firebase/auth", () => ({
	signOut: vi.fn(),
	getAuth: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
	auth: {},
}))

vi.mock("@/app/actions/auth", () => ({
	logout: vi.fn(),
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}))

import { useMutation } from "@apollo/client/react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

describe("UserSettings", () => {
	const mockDispatch = vi.fn()
	const mockUpdateHousehold = vi.fn()
	const mockDeleteHousehold = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		;(useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockDispatch,
		)
		;(useAppSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			id: "1",
			name: "My Household",
			budget: 1000,
		})
		;(useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
			(query) => {
				const operationName = query?.definitions?.[0]?.name?.value
				if (operationName === "UpdateHousehold") {
					return [mockUpdateHousehold, { loading: false }]
				}
				if (operationName === "DeleteHousehold") {
					return [mockDeleteHousehold, { loading: false }]
				}
				return [vi.fn(), { loading: false }]
			},
		)
	})

	it("renders with initial values", () => {
		render(<UserSettings />)
		expect(screen.getByDisplayValue("My Household")).toBeInTheDocument()
		const budgetInputs = screen.getAllByDisplayValue("1000")
		expect(budgetInputs.length).toBeGreaterThan(0)
	})

	it("calls updateHousehold on form submit", async () => {
		mockUpdateHousehold.mockResolvedValue({
			data: { updateHousehold: { success: true } },
		})

		render(<UserSettings />)

		const nameInput = screen.getByDisplayValue("My Household")
		fireEvent.change(nameInput, { target: { value: "New Name" } })

		const saveButton = screen.getByRole("button", { name: "save_changes" })

		await waitFor(() => {
			expect(saveButton).toBeEnabled()
		})

		fireEvent.click(saveButton)

		await waitFor(() => {
			expect(mockUpdateHousehold).toHaveBeenCalled()
		})
	})

	it("shows danger zone when clicking delete account button", () => {
		render(<UserSettings />)

		const dangerButton = screen.getByRole("button", {
			name: "delete_account_button",
		})
		fireEvent.click(dangerButton)

		expect(
			screen.getByRole("button", { name: "delete_button" }),
		).toBeInTheDocument()
		expect(screen.getByText("delete_title")).toBeInTheDocument()
	})
})
