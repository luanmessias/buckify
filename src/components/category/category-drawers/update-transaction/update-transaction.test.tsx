import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import type { Transaction } from "@/lib/types"
import { UpdateTransactionDrawer } from "./update-transaction"

vi.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}))

vi.mock("@apollo/client/react", () => ({
	useSuspenseQuery: vi.fn(() => ({
		data: {
			getCategories: [
				{ id: "cat1", name: "Category 1" },
				{ id: "cat2", name: "Category 2" },
			],
		},
	})),
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

const mockTransaction: Transaction = {
	id: "t1",
	description: "Test Transaction",
	amount: 50.0,
	date: "2023-10-27",
	categoryId: "cat1",
}

describe("UpdateTransactionDrawer", () => {
	it("should render nothing when not open", () => {
		render(
			<UpdateTransactionDrawer
				isOpen={false}
				onClose={vi.fn()}
				transaction={mockTransaction}
				onUpdate={vi.fn()}
				householdId="test-household"
			/>,
		)
		expect(screen.queryByText("edit_transaction")).not.toBeInTheDocument()
	})

	it("should render the form with transaction data when open", () => {
		render(
			<UpdateTransactionDrawer
				isOpen={true}
				onClose={vi.fn()}
				transaction={mockTransaction}
				onUpdate={vi.fn()}
				householdId="test-household"
			/>,
		)

		expect(screen.getByText("edit_transaction")).toBeInTheDocument()
		expect(screen.getByDisplayValue("Test Transaction")).toBeInTheDocument()
		expect(screen.getByDisplayValue("50.00")).toBeInTheDocument()
	})

	it("should call onUpdate with new values when saved", async () => {
		const mockOnUpdate = vi.fn()
		const user = userEvent.setup()

		render(
			<UpdateTransactionDrawer
				isOpen={true}
				onClose={vi.fn()}
				transaction={mockTransaction}
				onUpdate={mockOnUpdate}
				householdId="test-household"
			/>,
		)

		const descInput = screen.getByLabelText(
			"edit_transaction_field_description",
		)
		await user.clear(descInput)
		await user.type(descInput, "Updated Transaction")

		const amountInput = screen.getByDisplayValue("50.00")
		await user.clear(amountInput)
		await user.type(amountInput, "75.50")

		const saveButton = screen.getByRole("button", { name: "save_changes" })
		await user.click(saveButton)

		await waitFor(() => {
			expect(mockOnUpdate).toHaveBeenCalledWith("t1", {
				description: "Updated Transaction",
				amount: 75.5,
				categoryId: "cat1",
				date: "2023-10-27",
			})
		})
	})

	it("should disable save button if no changes", () => {
		render(
			<UpdateTransactionDrawer
				isOpen={true}
				onClose={vi.fn()}
				transaction={mockTransaction}
				onUpdate={vi.fn()}
				householdId="test-household"
			/>,
		)

		const saveButton = screen.getByRole("button", { name: "save_changes" })
		expect(saveButton).toBeDisabled()
	})
})
