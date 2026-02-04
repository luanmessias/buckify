import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { DeleteCategoryDrawer } from "./delete-category-drawer"

beforeAll(() => {
	Element.prototype.hasPointerCapture = () => false
	Element.prototype.setPointerCapture = () => {}
	Element.prototype.releasePointerCapture = () => {}
})

interface SelectProps {
	children: React.ReactNode
}

interface SelectValueProps {
	placeholder: string
}

vi.mock("@/components/ui/select", () => ({
	Select: ({ children }: SelectProps) => <div>{children}</div>,
	AvatarFallback: ({
		children,
		className,
	}: {
		children: React.ReactNode
		className?: string
	}) => <div className={className}>{children}</div>,
	SelectTrigger: ({ children }: SelectProps) => (
		<div role="combobox" aria-expanded="false" tabIndex={0}>
			{children}
		</div>
	),
	SelectValue: ({ placeholder }: SelectValueProps) => (
		<span>{placeholder}</span>
	),
	SelectContent: ({ children }: SelectProps) => <div>{children}</div>,
	SelectItem: ({ children }: SelectProps) => (
		<div role="option" aria-selected="false" tabIndex={0}>
			{children}
		</div>
	),
}))

const mockRouterPush = vi.fn()
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockRouterPush,
	}),
}))

vi.mock("next-intl", () => ({
	useTranslations: () => {
		const t = (key: string) => key
		t.rich = (key: string) => key
		return t
	},
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}))

const mockDeleteCategory = vi.fn()
const mockGetCategories = {
	getCategories: [
		{ id: "cat1", name: "Test Category" },
		{ id: "cat2", name: "Other Category" },
		{ id: "cat3", name: "Third Category" },
	],
}

vi.mock("@apollo/client/react", () => ({
	useMutation: () => [mockDeleteCategory, { loading: false }],
	useQuery: () => ({ data: mockGetCategories }),
}))

const mockCategory = {
	id: "cat1",
	name: "Test Category",
	budget: 500,
	icon: "home",
	color: "#000",
	slug: "test-category",
	description: "Test Description",
	householdId: "h1",
}

describe("DeleteCategoryDrawer", () => {
	it("should render drawer content when open", () => {
		render(
			<DeleteCategoryDrawer
				isOpen={true}
				onClose={() => {}}
				category={mockCategory}
				householdId="h1"
			/>,
		)

		expect(screen.getByText("delete_category_confirmation")).toBeInTheDocument()
		expect(screen.getByText("delete_category_warning")).toBeInTheDocument()
		expect(screen.getByLabelText("delete_all_transactions")).toBeInTheDocument()
		expect(screen.getByLabelText("move_transactions")).toBeInTheDocument()
	})

	it("should validate category name confirmation", async () => {
		const user = userEvent.setup()
		render(
			<DeleteCategoryDrawer
				isOpen={true}
				onClose={() => {}}
				category={mockCategory}
				householdId="h1"
			/>,
		)

		const deleteButton = screen.getByRole("button", { name: "delete_category" })
		expect(deleteButton).toBeDisabled()

		const input = screen.getByPlaceholderText("Test Category")
		await user.type(input, "Wrong Name")
		expect(deleteButton).toBeDisabled()

		await user.clear(input)
		await user.type(input, "Test Category")
		expect(deleteButton).toBeEnabled()
	})

	it("should show move options when 'move' is selected", async () => {
		const user = userEvent.setup()
		render(
			<DeleteCategoryDrawer
				isOpen={true}
				onClose={() => {}}
				category={mockCategory}
				householdId="h1"
			/>,
		)

		await user.click(screen.getByLabelText("move_transactions"))
		expect(screen.getByText("move_to")).toBeInTheDocument()
	})

	it("should filter out current category from move options", async () => {
		const user = userEvent.setup()
		render(
			<DeleteCategoryDrawer
				isOpen={true}
				onClose={() => {}}
				category={mockCategory}
				householdId="h1"
			/>,
		)

		await user.click(screen.getByLabelText("move_transactions"))

		const selectTrigger = screen.getByRole("combobox")
		await user.click(selectTrigger)

		expect(screen.getByText("Other Category")).toBeInTheDocument()
		expect(screen.getByText("Third Category")).toBeInTheDocument()
		expect(
			screen.queryByRole("option", { name: "Test Category" }),
		).not.toBeInTheDocument()
	})

	it("should call delete mutation and redirect on success", async () => {
		mockDeleteCategory.mockResolvedValue({
			data: {
				deleteCategory: {
					success: true,
					message: "Deleted",
				},
			},
		})
		const user = userEvent.setup()
		render(
			<DeleteCategoryDrawer
				isOpen={true}
				onClose={() => {}}
				category={mockCategory}
				householdId="h1"
			/>,
		)

		const input = screen.getByPlaceholderText("Test Category")
		await user.type(input, "Test Category")

		await user.click(screen.getByRole("button", { name: "delete_category" }))

		await waitFor(() => {
			expect(mockDeleteCategory).toHaveBeenCalledWith({
				variables: {
					id: "cat1",
					householdId: "h1",
					transferToCategoryId: null,
				},
				refetchQueries: ["GetDashboardData"],
			})
			expect(mockRouterPush).toHaveBeenCalledWith("/")
		})
	})
})
