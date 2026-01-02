"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { setHouseholdId } from "@/lib/features/household/household-slice"
import { type AppStore, makeStore } from "@/lib/store"

interface StoreProviderProps {
	children: React.ReactNode
	initialHouseholdId: string
}

export default function StoreProvider({
	children,
	initialHouseholdId,
}: StoreProviderProps) {
	const storeRef = useRef<AppStore | null>(null)

	if (!storeRef.current) {
		storeRef.current = makeStore()
		storeRef.current.dispatch(setHouseholdId(initialHouseholdId))
	}

	return <Provider store={storeRef.current}>{children}</Provider>
}
