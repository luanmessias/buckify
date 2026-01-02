import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface HouseholdState {
	id: string | null
	isLoading: boolean
}

const initialState: HouseholdState = {
	id: null,
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
	},
})

export const { setHouseholdId } = householdSlice.actions
export default householdSlice.reducer
