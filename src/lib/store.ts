import { configureStore } from "@reduxjs/toolkit"
import categoriesReducer from "@/lib/features/categories/categories-slice"
import householdReducer from "@/lib/features/household/household-slice"
import userReducer from "@/lib/features/user/user-slice"

export const makeStore = () => {
	return configureStore({
		reducer: {
			household: householdReducer,
			categories: categoriesReducer,
			user: userReducer,
		},
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
