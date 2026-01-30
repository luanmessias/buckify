import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Category } from "@/lib/types"

interface CategoriesState {
	items: Category[]
	isInitialized: boolean
}

const initialState: CategoriesState = {
	items: [],
	isInitialized: false,
}

export const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<Category[]>) => {
			state.items = action.payload
			state.isInitialized = true
		},
	},
})
export const { setCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
