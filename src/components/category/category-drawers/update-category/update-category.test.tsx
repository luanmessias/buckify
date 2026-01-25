import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { UpdateCategoryDrawer } from "./update-category"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("@/components/ui/slider", () => ({
	Slider: ({
		onValueChange,
		value,
	}: {
		onValueChange: (val: number[]) => void
		value: number[]
	}) => (
		<input
			type="range"
			onChange={(e) => onValueChange([Number(e.target.value)])}
			value={value[0]}
			data-testid="slider"
		/>
	),
}))

vi.mock("@/components/ui/icon-picker", () => ({
	IconPicker: ({
		value,
		onChange,
	}: {
		value: string
		onChange: (icon: string) => void
	}) => (
		<button
			type="button"
			onClick={() => onChange("new-icon")}
			data-testid="icon-picker"
		>
			{value}
		</button>
	),
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

describe("UpdateCategoryDrawer", () => {
	it("should render nothing when not open", () => {
		render(
			<UpdateCategoryDrawer
				isOpen={false}
				onClose={vi.fn()}
				category={mockCategory}
				onUpdate={vi.fn()}
			/>,
		)
		expect(screen.queryByText("edit_category")).not.toBeInTheDocument()
	})

	it("should render the form with category data when open", () => {
		render(
			<UpdateCategoryDrawer
				isOpen={true}
				onClose={vi.fn()}
				category={mockCategory}
				onUpdate={vi.fn()}
			/>,
		)

		expect(screen.getByText("edit_category")).toBeInTheDocument()
		expect(screen.getByDisplayValue("Test Category")).toBeInTheDocument()
		expect(screen.getByDisplayValue("500.00")).toBeInTheDocument()
	})

	it("should call onUpdate with new values when saved", async () => {
		const mockOnUpdate = vi.fn()
		const user = userEvent.setup()

		render(
			<UpdateCategoryDrawer
				isOpen={true}
				onClose={vi.fn()}
				category={mockCategory}
				onUpdate={mockOnUpdate}
			/>,
		)

		const nameInput = screen.getByPlaceholderText("name_placeholder")
		await user.clear(nameInput)
		await user.type(nameInput, "Updated Category")

		const budgetInput = screen.getByDisplayValue("500.00")
		await user.clear(budgetInput)
		await user.type(budgetInput, "750.50")

		const iconPicker = screen.getByTestId("icon-picker")
		await user.click(iconPicker)

		const saveButton = screen.getByRole("button", { name: "save_changes" })
		await user.click(saveButton)

		await waitFor(() => {
			expect(mockOnUpdate).toHaveBeenCalledWith("cat1", {
				name: "Updated Category",
				budget: 750.5,
				icon: "new-icon",
				description: "Test Description",
				color: "#000",
			})
		})
	})

	it("should disable save button if no changes", () => {
		render(
			<UpdateCategoryDrawer
				isOpen={true}
				onClose={vi.fn()}
				category={mockCategory}
				onUpdate={vi.fn()}
			/>,
		)

		const saveButton = screen.getByRole("button", { name: "save_changes" })
		expect(saveButton).toBeDisabled()
	})
})
