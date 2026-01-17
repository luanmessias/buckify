import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { vi } from "vitest"
import { makeStore } from "@/lib/store"
import messages from "@/messages/en.json"
import { CreateCategoryDrawer } from "./create-category-drawer"

// Mock matchMedia to simulate desktop environment
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: true, // Always true for desktop simulation
		media: query,
		onchange: null,
		addListener: vi.fn(), // Deprecated
		removeListener: vi.fn(), // Deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

// Mock translations
vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => {
		// Flatten the messages object to look up keys
		const flattenMessages = (obj: any, prefix = "") => {
			return Object.keys(obj).reduce((acc: any, k: any) => {
				const pre = prefix.length ? prefix + "." : ""
				if (typeof obj[k] === "object" && obj[k] !== null) {
					Object.assign(acc, flattenMessages(obj[k], pre + k))
				} else {
					acc[pre + k] = obj[k]
				}
				return acc
			}, {})
		}
		const flat = flattenMessages(messages)

		// Handle specific namespace lookups if needed, or just return the key if not found
		// Ideally we would map the namespace passed to useTranslations to the keys in messages
		// For simplicity in this test, we can try to find the key in the flat object
		// But since we are passing specific keys like "name_placeholder" which are keys in the json...

		// Let's improve this:
		// The component calls useTranslations("Categories")
		// The key passed is "name_placeholder"
		// We expect messages.Categories.name_placeholder

		// If key exists in messages.Categories, return it.
		// Since we don't know the namespace here easily without complex mocking,
		// let's just search in all namespaces or specific ones we know.

		if (messages.Categories[key as keyof typeof messages.Categories]) {
			return messages.Categories[key as keyof typeof messages.Categories]
		}
		if (messages.Category[key as keyof typeof messages.Category]) {
			return messages.Category[key as keyof typeof messages.Category]
		}
		if (messages.Common[key as keyof typeof messages.Common]) {
			return messages.Common[key as keyof typeof messages.Common]
		}
		if (messages.Components[key as keyof typeof messages.Components]) {
			return messages.Components[key as keyof typeof messages.Components]
		}

		return key
	},
}))

const renderWithProviders = (ui: React.ReactElement) => {
	const store = makeStore()
	return render(<Provider store={store}>{ui}</Provider>)
}

describe("CreateCategoryDrawer", () => {
	const mockOnClose = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render nothing when not open", () => {
		renderWithProviders(
			<CreateCategoryDrawer
				isOpen={false}
				onClose={mockOnClose}
				onConfirm={vi.fn()}
			/>,
		)
		expect(
			screen.queryByText(messages.Categories.new_category),
		).not.toBeInTheDocument()
	})

	it("should render the form when open", () => {
		renderWithProviders(
			<CreateCategoryDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={vi.fn()}
			/>,
		)

		expect(
			screen.getByText(messages.Categories.new_category),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(messages.Categories.name_placeholder),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(messages.Categories.description_placeholder),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(messages.Categories.budget_placeholder),
		).toBeInTheDocument()
	})

	it("should submit the form successfully", async () => {
		const user = userEvent.setup()
		const mockOnConfirm = vi.fn()

		renderWithProviders(
			<CreateCategoryDrawer
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
			/>,
		)

		const nameInput = screen.getByPlaceholderText(
			messages.Categories.name_placeholder,
		)
		const descriptionInput = screen.getByPlaceholderText(
			messages.Categories.description_placeholder,
		)
		const budgetInput = screen.getByPlaceholderText(
			messages.Categories.budget_placeholder,
		)
		const iconTrigger = screen.getByRole("combobox")
		await user.click(iconTrigger)

		const searchInput = await screen.findByPlaceholderText("Search icon...")
		await user.type(searchInput, "home")

		const homeIcon = await screen.findByRole("button", { name: "home" })
		await user.click(homeIcon)

		await user.type(nameInput, "New Category")
		await user.type(descriptionInput, "Category Description")
		await user.type(budgetInput, "500")

		const form = document.querySelector("form")
		if (form) {
			fireEvent.submit(form)
		}

		await waitFor(() => {
			expect(mockOnConfirm).toHaveBeenCalledWith({
				name: "New Category",
				description: "Category Description",
				budget: 500,
				color: "",
				icon: "home",
			})
		})
	})

	it("should show validation errors for invalid input", async () => {
		renderWithProviders(
			<CreateCategoryDrawer
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
				screen.getByText(messages.Categories.name_min_length),
			).toBeInTheDocument()
			expect(
				screen.getByText(messages.Categories.description_min_length),
			).toBeInTheDocument()
			expect(
				screen.getByText(messages.Categories.budget_min),
			).toBeInTheDocument()
		})
	})
})
