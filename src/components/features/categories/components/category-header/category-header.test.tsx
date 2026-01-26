import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { CategoryHeader } from "./category-header"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("next/navigation", () => ({
	useSearchParams: () => ({
		get: () => "2023-10",
	}),
}))

const mockUpdateCategory = vi.fn()
vi.mock("@apollo/client/react", () => ({
	useMutation: () => [mockUpdateCategory, { loading: false }],
}))

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}))

vi.mock("@/components/common/month-selector/month-selector", () => ({
	MonthSelector: () => <div data-testid="month-selector">Month Selector</div>,
}))

vi.mock(
	"@/components/features/categories/components/update-category-drawer/update-category",
	() => ({
		UpdateCategoryDrawer: ({
			isOpen,
			onUpdate,
		}: {
			isOpen: boolean
			onUpdate: (
				id: string,
				data: { name: string; budget: number; icon: string },
			) => void
		}) =>
			isOpen ? (
				<button
					type="button"
					onClick={() =>
						onUpdate("cat1", {
							name: "Updated",
							budget: 100,
							icon: "home",
						})
					}
					data-testid="mock-drawer-save"
				>
					Save Drawer
				</button>
			) : null,
	}),
)

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

describe("CategoryHeader", () => {
	it("should render header elements", () => {
		render(<CategoryHeader category={mockCategory} householdId="h1" />)

		expect(screen.getByLabelText("back")).toBeInTheDocument()
		expect(screen.getByTestId("month-selector")).toBeInTheDocument()
		expect(screen.getByLabelText("edit_category")).toBeInTheDocument()
	})

	it("should open drawer when edit button is clicked", async () => {
		const user = userEvent.setup()
		render(<CategoryHeader category={mockCategory} householdId="h1" />)

		expect(screen.queryByTestId("mock-drawer-save")).not.toBeInTheDocument()

		await user.click(screen.getByLabelText("edit_category"))

		expect(screen.getByTestId("mock-drawer-save")).toBeInTheDocument()
	})

	it("should call mutation when drawer saves", async () => {
		mockUpdateCategory.mockResolvedValue({
			data: {
				updateCategory: {
					success: true,
				},
			},
		})
		const user = userEvent.setup()
		render(<CategoryHeader category={mockCategory} householdId="h1" />)

		await user.click(screen.getByLabelText("edit_category"))
		await user.click(screen.getByTestId("mock-drawer-save"))

		await waitFor(() => {
			expect(mockUpdateCategory).toHaveBeenCalledWith({
				variables: {
					id: "cat1",
					householdId: "h1",
					input: {
						name: "Updated",
						budget: 100,
						icon: "home",
					},
				},
			})
		})
	})
})
