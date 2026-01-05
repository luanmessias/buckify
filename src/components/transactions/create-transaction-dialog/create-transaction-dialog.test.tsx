import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { Provider } from "react-redux"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeStore } from "@/lib/store"
import messages from "@/messages/pt.json"
import { CreateTransactionDialog } from "./create-transaction-dialog"

const createTransactionMock = vi.fn()

vi.mock("@apollo/client/react", () => ({
	useMutation: vi.fn(() => [createTransactionMock, { loading: false }]),
}))

const renderWithProviders = (ui: React.ReactElement) => {
	const store = makeStore()
	return render(
		<Provider store={store}>
			<NextIntlClientProvider locale="pt" messages={messages}>
				{ui}
			</NextIntlClientProvider>
		</Provider>,
	)
}

describe("CreateTransactionDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render the dialog trigger button", () => {
		renderWithProviders(<CreateTransactionDialog />)

		expect(screen.getByRole("button")).toBeInTheDocument()
	})

	it("should open the dialog and render the form", async () => {
		const user = userEvent.setup()

		renderWithProviders(<CreateTransactionDialog />)

		const button = screen.getByRole("button")
		await user.click(button)

		expect(
			screen.getByRole("heading", { name: "new_expense" }),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("amount_placeholder"),
		).toBeInTheDocument()
		expect(screen.getByPlaceholderText("example_dinner")).toBeInTheDocument()
		expect(screen.getByRole("combobox")).toBeInTheDocument()
		expect(
			screen.getByDisplayValue(new Date().toISOString().split("T")[0]),
		).toBeInTheDocument()
	})

	it("should submit the form successfully", async () => {
		const user = userEvent.setup()

		createTransactionMock.mockResolvedValue({
			data: {
				CreateTransaction: {
					id: "1",
					description: "Test transaction",
					amount: 100,
				},
			},
		})

		renderWithProviders(<CreateTransactionDialog />)

		const button = screen.getByRole("button")
		await user.click(button)

		const amountInput = screen.getByPlaceholderText("amount_placeholder")
		const descriptionInput = screen.getByPlaceholderText("example_dinner")
		const dateInput = screen.getByDisplayValue(
			new Date().toISOString().split("T")[0],
		)

		await user.type(amountInput, "100")
		await user.type(descriptionInput, "Test transaction")
		fireEvent.change(dateInput, { target: { value: "2024-01-01" } })

		const form = document.querySelector("form")
		if (form) {
			fireEvent.submit(form)
		}

		await waitFor(() => {
			expect(createTransactionMock).toHaveBeenCalledWith({
				variables: {
					data: {
						description: "Test transaction",
						amount: 100,
						categoryId: "casa",
						date: "2024-01-01",
						type: "expense",
					},
				},
			})
		})
	})

	it("should show validation errors for invalid input", async () => {
		const user = userEvent.setup()

		renderWithProviders(<CreateTransactionDialog />)

		const button = screen.getByRole("button")
		await user.click(button)

		const form = document.querySelector("form")
		if (form) {
			fireEvent.submit(form)
		}

		await waitFor(() => {
			expect(screen.getByText("description_min_length")).toBeInTheDocument()
			expect(screen.getByText("amount_min")).toBeInTheDocument()
		})
	})
})
