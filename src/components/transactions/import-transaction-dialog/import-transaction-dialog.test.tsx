import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { scanBankStatement } from "@/actions/scan-statement"
import { setCategories } from "@/lib/features/categories/categories-slice"
import { makeStore } from "@/lib/store"
import { ImportTransactionDialog } from "./import-transaction-dialog"

vi.mock("@/actions/scan-statement", () => ({
	scanBankStatement: vi.fn(),
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}))

vi.mock("@/components/ui/scroll-area", () => ({
	ScrollArea: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="scroll-area">{children}</div>
	),
}))

const renderWithProvider = (ui: React.ReactElement, store = makeStore()) => {
	return render(<Provider store={store}>{ui}</Provider>)
}

describe("ImportTransactionDialog", () => {
	const mockOnClose = vi.fn()
	const mockOnConfirm = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render nothing when not open", () => {
		renderWithProvider(
			<ImportTransactionDialog
				isOpen={false}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)
		expect(
			screen.queryByText("Importar Extrato com IA"),
		).not.toBeInTheDocument()
	})

	it("should render upload step when open", () => {
		renderWithProvider(
			<ImportTransactionDialog
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)
		expect(screen.getByText("Importar Extrato com IA")).toBeInTheDocument()
		expect(screen.getByText("Clique para enviar")).toBeInTheDocument()
	})

	it("should handle file upload and display transactions", async () => {
		const mockTransactions = [
			{
				id: "1",
				date: "2024-01-01",
				description: "Test Transaction",
				amount: 100,
				categoryId: "cat1",
				isPossibleDuplicate: false,
			},
		]
		const mockCategories = [{ id: "cat1", name: "Food" }]

		;(scanBankStatement as unknown as Mock).mockResolvedValue({
			success: true,
			data: mockTransactions,
			categories: mockCategories,
		})

		const store = makeStore()
		store.dispatch(setCategories(mockCategories))

		renderWithProvider(
			<ImportTransactionDialog
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
			store,
		)

		const file = new File(["dummy content"], "statement.pdf", {
			type: "application/pdf",
		})

		const input = document.querySelector('input[type="file"]')

		expect(input).toBeInTheDocument()
		if (input) {
			fireEvent.change(input, { target: { files: [file] } })
		}

		await waitFor(() => {
			expect(screen.getByText("Test Transaction")).toBeInTheDocument()
		})

		expect(screen.getByText("Food")).toBeInTheDocument()
	})

	it("should show duplicate warning", async () => {
		const mockTransactions = [
			{
				id: "2",
				date: "2024-01-01",
				description: "Dup Transaction",
				amount: 100,
				categoryId: "cat1",
				isPossibleDuplicate: true,
			},
		]
		;(scanBankStatement as unknown as Mock).mockResolvedValue({
			success: true,
			data: mockTransactions,
			categories: [],
		})

		renderWithProvider(
			<ImportTransactionDialog
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)

		const input = document.querySelector('input[type="file"]')
		if (input) {
			fireEvent.change(input, { target: { files: [new File([], "t.pdf")] } })
		}

		await waitFor(() => {
			expect(screen.getByText("Dup Transaction")).toBeInTheDocument()
		})

		const rowText = screen.getByText("Dup Transaction")
		const row = rowText.closest(".border")
		expect(row).toHaveClass("bg-amber-500/10")
	})

	it("should call onConfirm with transactions", async () => {
		const mockTransactions = [
			{
				id: "3",
				date: "2024-01-01",
				description: "Test Transaction",
				amount: 100,
				categoryId: "cat1",
				isPossibleDuplicate: false,
			},
		]
		;(scanBankStatement as unknown as Mock).mockResolvedValue({
			success: true,
			data: mockTransactions,
			categories: [{ id: "cat1", name: "Food" }],
		})

		renderWithProvider(
			<ImportTransactionDialog
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)

		const input = document.querySelector('input[type="file"]')
		if (input) {
			fireEvent.change(input, { target: { files: [new File([], "t.pdf")] } })
		}

		await waitFor(() => {
			expect(screen.getByText("Confirmar Importação")).toBeInTheDocument()
		})

		fireEvent.click(screen.getByText("Confirmar Importação"))

		expect(mockOnConfirm).toHaveBeenCalled()
		expect(mockOnConfirm.mock.calls[0][0][0]).toMatchObject({
			description: "Test Transaction",
		})
	})

	it("should remove an item", async () => {
		const mockTransactions = [
			{
				id: "4",
				date: "2024-01-01",
				description: "To Remove",
				amount: 100,
				categoryId: "cat1",
				isPossibleDuplicate: false,
			},
		]
		;(scanBankStatement as unknown as Mock).mockResolvedValue({
			success: true,
			data: mockTransactions,
			categories: [],
		})

		renderWithProvider(
			<ImportTransactionDialog
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)

		const input = document.querySelector('input[type="file"]')
		if (input) {
			fireEvent.change(input, { target: { files: [new File([], "t.pdf")] } })
		}

		await waitFor(() => {
			expect(screen.getByText("To Remove")).toBeInTheDocument()
		})

		const row = screen.getByText("To Remove").closest(".border")
		const removeBtn = row?.querySelector("button")

		if (removeBtn) {
			fireEvent.click(removeBtn)
		}

		await waitFor(() => {
			expect(screen.queryByText("To Remove")).not.toBeInTheDocument()
		})
	})
})
