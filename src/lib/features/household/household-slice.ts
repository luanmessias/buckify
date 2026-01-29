import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface HouseholdState {
	id: string | null
	name: string | null
	budget: number
	currency: string
	isLoading: boolean
}

const initialState: HouseholdState = {
	id: null,
	name: null,
	budget: 0,
	currency: "EUR",
	isLoading: true,
}

export const householdSlice = createSlice({
	name: "household",
	initialState,
	reducers: {
		setHouseholdId: (state, action: PayloadAction<string>) => {
			state.id = action.payload
			state.isLoading = false
		},
		setHouseholdData: (
			state,
			action: PayloadAction<{
				name: string
				budget: number
				currency?: string
			}>,
		) => {
			state.name = action.payload.name
			state.budget = action.payload.budget

			if (action.payload.currency) state.currency = action.payload.currency

			state.isLoading = false
		},
		updateBudget: (state, action: PayloadAction<number>) => {
			state.budget = action.payload
		},
	},
})

export const { setHouseholdId, setHouseholdData, updateBudget } =
	householdSlice.actions
export default householdSlice.reducer
