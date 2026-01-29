import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
	uid: string | null
	email: string | null
	name: string | null
	photoURL: string | null
	loading: boolean
}

const initialState: UserState = {
	uid: null,
	email: null,
	name: null,
	photoURL: null,
	loading: true,
}

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (
			state,
			action: PayloadAction<Omit<UserState, "loading"> | null>,
		) => {
			if (action.payload) {
				state.uid = action.payload.uid
				state.email = action.payload.email
				state.name = action.payload.name
				state.photoURL = action.payload.photoURL
				state.loading = false
			} else {
				state.uid = null
				state.email = null
				state.name = null
				state.photoURL = null
				state.loading = false
			}
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload
		},
	},
})

export const { setUser, setLoading } = userSlice.actions
export default userSlice.reducer
