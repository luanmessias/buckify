import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Category {
	id: string
	name: string
}

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
