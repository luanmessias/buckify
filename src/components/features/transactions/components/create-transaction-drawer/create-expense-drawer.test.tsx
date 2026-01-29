import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeStore } from "@/lib/store"
import messages from "@/messages/en.json"
import { CreateExpenseDrawer } from "./create-expense-drawer"

const createTransactionMock = vi.fn()

vi.mock("next-intl", () => ({
	useTranslations: vi.fn((namespace: string) => (key: string) => {
		if (namespace === "Transactions") {
			return (
				(messages.Transactions as unknown as Record<string, string>)[key] || key
			)
		}
		if (namespace === "Common") {
			return (messages.Common as unknown as Record<string, string>)[key] || key
		}
		return key
	}),
}))

vi.mock("@apollo/client/react", () => ({
	useMutation: vi.fn(() => [createTransactionMock, { loading: false }]),
}))

const renderWithProviders = (ui: React.ReactElement) => {
	const store = makeStore()
	return render(<Provider store={store}>{ui}</Provider>)
}

describe("CreateExpenseDrawer", () => {
	const mockOnClose = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render nothing when not open", () => {
		renderWithProviders(
			<CreateExpenseDrawer
				isOpen={false}
				onClose={mockOnClose}
				onConfirm={vi.fn()}
			/>,
		)
		expect(
			screen.queryByText(messages.Transactions.new_expense),
		).not.toBeInTheDocument()
	})

	it("should render the form when open", () => {
		renderWithProviders(
			<CreateExpenseDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={vi.fn()}
			/>,
		)

		expect(
			screen.getByText(messages.Transactions.new_expense),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(messages.Transactions.amount_placeholder),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(messages.Transactions.example_dinner),
		).toBeInTheDocument()
		expect(screen.getByRole("combobox")).toBeInTheDocument()
		expect(
			screen.getByDisplayValue(new Date().toISOString().split("T")[0]),
		).toBeInTheDocument()
	})

	it("should submit the form successfully", async () => {
		const user = userEvent.setup()
		const mockOnConfirm = vi.fn()

		renderWithProviders(
			<CreateExpenseDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)

		const amountInput = screen.getByPlaceholderText(
			messages.Transactions.amount_placeholder,
		)
		const descriptionInput = screen.getByPlaceholderText(
			messages.Transactions.example_dinner,
		)
		const dateInput = screen.getByDisplayValue(
			new Date().toISOString().split("T")[0],
		)

		await user.clear(amountInput)
		await user.type(amountInput, "100")
		await user.clear(descriptionInput)
		await user.type(descriptionInput, "Test transaction")
		fireEvent.change(dateInput, { target: { value: "2024-01-01" } })

		const form = document.querySelector("form")
		if (form) {
			fireEvent.submit(form)
		}

		await waitFor(() => {
			expect(mockOnConfirm).toHaveBeenCalledWith({
				description: "Test transaction",
				amount: 100,
				categoryId: "casa",
				date: "2024-01-01",
			})
		})
	})

	it("should show validation errors for invalid input", async () => {
		const _user = userEvent.setup()

		renderWithProviders(
			<CreateExpenseDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={vi.fn()}
			/>,
		)

		const form = document.querySelector("form")
		if (form) {
			fireEvent.submit(form)
		}

		await waitFor(() => {
			expect(
				screen.getByText(messages.Transactions.amount_min),
			).toBeInTheDocument()
		})
	})

	it("should respect defaultCategoryId and forceCategory props", async () => {
		const mockOnConfirm = vi.fn()
		const defaultCategory = "food"

		renderWithProviders(
			<CreateExpenseDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				defaultCategoryId={defaultCategory}
				forceCategory={true}
			/>,
		)

		const selectTrigger = screen.getByRole("combobox")
		expect(selectTrigger).toBeDisabled()
	})
})
