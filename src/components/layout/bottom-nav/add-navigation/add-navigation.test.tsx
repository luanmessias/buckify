import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { useAppSelector } from "@/lib/hooks"
import { AddNavigation } from "./add-navigation"

vi.mock("@apollo/client/react", () => ({
	ApolloProvider: ({ children }: { children: React.ReactNode }) => children,
	useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
}))

vi.mock("@/lib/utils", () => ({
	cn: (...classes: (string | undefined | null | boolean)[]) =>
		classes.filter(Boolean).join(" "),
}))

vi.mock("sonner", () => ({
	toast: vi.fn(),
}))

vi.mock(
	"@/components/features/transactions/components/import-transaction-drawer/import-transaction-drawer",
	() => ({
		ImportTransactionDrawer: ({
			isOpen,
			onClose,
		}: {
			isOpen: boolean
			onClose: () => void
		}) =>
			isOpen ? (
				<div data-testid="import-dialog">
					Import Dialog{" "}
					<button type="button" onClick={onClose}>
						Close
					</button>
				</div>
			) : null,
	}),
)

vi.mock(
	"@/components/features/transactions/components/create-transaction-drawer/create-expense-drawer",
	() => ({
		CreateExpenseDrawer: ({
			isOpen,
			onClose,
		}: {
			isOpen: boolean
			onClose: () => void
		}) =>
			isOpen ? (
				<div data-testid="create-expense-drawer">
					Create Expense Drawer{" "}
					<button type="button" onClick={onClose}>
						Close
					</button>
				</div>
			) : null,
	}),
)

vi.mock("@/lib/hooks", () => ({
	useAppSelector: vi.fn(),
}))

vi.mock("@/actions/scan-statement", () => ({
	scanBankStatement: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: [
				{
					date: "2023-01-01",
					description: "Test",
					amount: 100,
					categoryId: "1",
				},
			],
			categories: [],
		}),
	),
}))

describe("AddNavigation Component", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		;(useAppSelector as unknown as Mock).mockReturnValue("test-household-id")
	})

	it("should render the floating action button", () => {
		render(<AddNavigation />)

		expect(screen.getByRole("button", { name: "" })).toBeInTheDocument()
	})

	it("should toggle the menu when clicked", () => {
		render(<AddNavigation />)

		const fab = screen.getByRole("button", { name: "" })

		const menuItem = screen.getByText("scan_statement")

		const menuContainer = menuItem.closest("div.absolute.bottom-24")
		expect(menuContainer).toHaveClass("pointer-events-none")

		fireEvent.click(fab)

		expect(menuContainer).toHaveClass("pointer-events-auto")

		fireEvent.click(fab)
		expect(menuContainer).toHaveClass("pointer-events-none")
	})

	it("should open the import dialog when 'Ler com IA' is clicked", () => {
		render(<AddNavigation />)

		const fab = screen.getByRole("button", { name: "" })
		fireEvent.click(fab)

		const importButton = screen.getByText("scan_statement").closest("button")
		expect(importButton).toBeInTheDocument()
		if (importButton) {
			fireEvent.click(importButton)
		}

		expect(screen.getByTestId("import-dialog")).toBeInTheDocument()
	})

	it("should close the import dialog when onClose is called", () => {
		render(<AddNavigation />)

		fireEvent.click(screen.getByRole("button", { name: "" }))
		const importButton = screen.getByText("scan_statement").closest("button")
		expect(importButton).toBeInTheDocument()
		if (importButton) {
			fireEvent.click(importButton)
		}

		expect(screen.getByTestId("import-dialog")).toBeInTheDocument()

		fireEvent.click(screen.getByText("Close"))

		expect(screen.queryByTestId("import-dialog")).not.toBeInTheDocument()
	})
})
