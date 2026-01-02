import { configureStore } from "@reduxjs/toolkit"
import categoriesReducer from "@/lib/features/categories/categories-slice"
import householdReducer from "@/lib/features/household/household-slice"

export const makeStore = () => {
	return configureStore({
		reducer: {
			household: householdReducer,
			categories: categoriesReducer,
		},
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
