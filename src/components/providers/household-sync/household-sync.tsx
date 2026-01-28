"use client"

import { gql } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/client/react"
import { useEffect } from "react"
import { setHouseholdData } from "@/lib/features/household/household-slice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import type { Household } from "@/lib/types"

const GET_HOUSEHOLD_DATA = gql`
  query GetHouseholdData($id: ID!) {
    household(id: $id) {
      name
      budget
      currency
    }
  }
`

function HouseholdSyncFetcher({ id }: { id: string }) {
	const dispatch = useAppDispatch()
	const { data } = useSuspenseQuery<{ household: Household }>(
		GET_HOUSEHOLD_DATA,
		{
			variables: { id },
		},
	)

	useEffect(() => {
		if (data?.household) {
			dispatch(
				setHouseholdData({
					name: data.household.name,
					budget: data.household.budget || 0,
					currency: data.household.currency || "EUR",
				}),
			)
		}
	}, [data, dispatch])

	return null
}

export function HouseholdSync() {
	const { id } = useAppSelector((state) => state.household)

	if (!id) return null

	return <HouseholdSyncFetcher id={id} />
}
