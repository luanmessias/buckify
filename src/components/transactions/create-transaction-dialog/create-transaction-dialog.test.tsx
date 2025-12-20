import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, it, vi } from "vitest"
import messages from "@/messages/pt.json"
import { CreateTransactionDialog } from "./create-transaction-dialog"

const createTransactionMock = vi.fn()

vi.mock("@apollo/client/react", () => ({
	useMutation: vi.fn(() => [createTransactionMock, { loading: false }]),
}))

describe("CreateTransactionDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render the dialog trigger button", () => {
		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CreateTransactionDialog />
			</NextIntlClientProvider>,
		)

		expect(screen.getByRole("button")).toBeInTheDocument()
	})

	it("should open the dialog and render the form", async () => {
		const user = userEvent.setup()

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CreateTransactionDialog />
			</NextIntlClientProvider>,
		)

		const button = screen.getByRole("button")
		await user.click(button)

		expect(screen.getByText("new_expense")).toBeInTheDocument()
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

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CreateTransactionDialog />
			</NextIntlClientProvider>,
		)

		const button = screen.getByRole("button")
		await user.click(button)

		const amountInput = screen.getByPlaceholderText("amount_placeholder")
		const descriptionInput = screen.getByPlaceholderText("example_dinner")
		const dateInput = screen.getByDisplayValue(
			new Date().toISOString().split("T")[0],
		)
		const submitButton = screen.getByRole("button", {
			name: "add_expense",
		})

		await user.type(amountInput, "100")
		await user.type(descriptionInput, "Test transaction")
		fireEvent.change(dateInput, { target: { value: "2024-01-01" } })
		fireEvent.submit(document.querySelector("form")!)

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

		render(
			<NextIntlClientProvider locale="pt" messages={messages}>
				<CreateTransactionDialog />
			</NextIntlClientProvider>,
		)

		const button = screen.getByRole("button")
		await user.click(button)

		fireEvent.submit(document.querySelector("form")!)

		await waitFor(() => {
			expect(screen.getByText("description_min_length")).toBeInTheDocument()
			expect(screen.getByText("amount_min")).toBeInTheDocument()
		})
	})
})
