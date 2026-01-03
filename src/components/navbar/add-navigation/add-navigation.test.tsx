import { type MockedResponse, MockLink } from "@apollo/client/testing"
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
} from "@apollo/client-integration-nextjs"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"
import { useAppSelector } from "@/lib/hooks"
import { AddNavigation } from "./add-navigation"

const MockedProvider = ({
	mocks = [],
	children,
}: {
	mocks?: ReadonlyArray<MockedResponse>
	children: React.ReactNode
}) => {
	return (
		<ApolloNextAppProvider
			makeClient={() => {
				return new ApolloClient({
					cache: new InMemoryCache(),
					link: new MockLink(mocks),
				})
			}}
		>
			{children}
		</ApolloNextAppProvider>
	)
}

// Mock utilities
vi.mock("@/lib/utils", () => ({
	cn: (...classes: (string | undefined | null | boolean)[]) =>
		classes.filter(Boolean).join(" "),
}))

vi.mock("sonner", () => ({
	toast: vi.fn(),
}))

// Mock sub-components
vi.mock(
	"@/components/transactions/import-transaction-dialog/import-transaction-dialog",
	() => ({
		ImportTransactionDialog: ({
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

// We use real components for UI elements to ensure integration works,
// and because mocks were causing issues.
// We keep ImportTransactionDialog mocked because it's complex.

// Mock Redux hooks
vi.mock("@/lib/hooks", () => ({
	useAppSelector: vi.fn(),
}))

describe("AddNavigation Component", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		;(useAppSelector as unknown as Mock).mockReturnValue("test-household-id")
	})

	it("should render the floating action button", () => {
		render(
			<MockedProvider>
				<AddNavigation />
			</MockedProvider>,
		)

		expect(screen.getByRole("button", { name: "" })).toBeInTheDocument()
	})

	it("should toggle the menu when clicked", () => {
		render(
			<MockedProvider>
				<AddNavigation />
			</MockedProvider>,
		)

		const fab = screen.getByRole("button", { name: "" })

		// Initial state: menu items are hidden (pointer-events-none)
		// We can check for one of the menu items text
		const menuItem = screen.getByText("Ler com IA")
		// The parent div controls visibility
		const menuContainer = menuItem.closest("div.absolute.bottom-24")
		expect(menuContainer).toHaveClass("pointer-events-none")

		fireEvent.click(fab)

		// Now should be visible
		expect(menuContainer).toHaveClass("pointer-events-auto")

		fireEvent.click(fab)
		expect(menuContainer).toHaveClass("pointer-events-none")
	})

	it("should open the import dialog when 'Ler com IA' is clicked", () => {
		render(
			<MockedProvider>
				<AddNavigation />
			</MockedProvider>,
		)

		const fab = screen.getByRole("button", { name: "" })
		fireEvent.click(fab) // Open menu

		const importButton = screen.getByText("Ler com IA").closest("button")
		expect(importButton).toBeInTheDocument()
		if (importButton) {
			fireEvent.click(importButton)
		}

		expect(screen.getByTestId("import-dialog")).toBeInTheDocument()
	})

	it("should close the import dialog when onClose is called", () => {
		render(
			<MockedProvider>
				<AddNavigation />
			</MockedProvider>,
		)

		// Open dialog
		fireEvent.click(screen.getByRole("button", { name: "" }))
		const importButton = screen.getByText("Ler com IA").closest("button")
		expect(importButton).toBeInTheDocument()
		if (importButton) {
			fireEvent.click(importButton)
		}

		expect(screen.getByTestId("import-dialog")).toBeInTheDocument()

		// Close dialog
		fireEvent.click(screen.getByText("Close"))

		expect(screen.queryByTestId("import-dialog")).not.toBeInTheDocument()
	})
})
