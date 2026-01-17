import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { vi } from "vitest"
import { makeStore } from "@/lib/store"
import messages from "@/messages/en.json"
import { CreateCategoryDrawer } from "./create-category-drawer"

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: true,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => {
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
