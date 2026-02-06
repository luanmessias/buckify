"use client"

import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut } from "firebase/auth"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Typography } from "@/components/ui/typography"
import { setHouseholdData } from "@/lib/features/household/household-slice"
import { auth } from "@/lib/firebase"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

const UPDATE_HOUSEHOLD = gql`
  mutation UpdateHousehold($id: ID!, $input: UpdateHouseholdInput!) {
    updateHousehold(id: $id, input: $input) {
      success
      message
    }
  }
`

const DELETE_HOUSEHOLD = gql`
  mutation DeleteHousehold($id: ID!) {
    deleteHousehold(id: $id) {
      success
      message
    }
  }
`

interface UpdateHouseholdResult {
	updateHousehold: {
		success: boolean
		message: string
	}
}

interface DeleteHouseholdResult {
	deleteHousehold: {
		success: boolean
		message: string
	}
}

export const UserSettings = () => {
	const t = useTranslations("UserSettings")
	const dispatch = useAppDispatch()
	const router = useRouter()
	const {
		id: householdId,
		name: currentName,
		budget: currentBudget,
	} = useAppSelector((state) => state.household)

	const [updateHousehold, { loading }] =
		useMutation<UpdateHouseholdResult>(UPDATE_HOUSEHOLD)

	const [deleteHousehold, { loading: deleting }] =
		useMutation<DeleteHouseholdResult>(DELETE_HOUSEHOLD)

	const [deleteConfirmation, setDeleteConfirmation] = useState("")
	const [showDangerZone, setShowDangerZone] = useState(false)

	const settingsSchema = z.object({
		name: z.string().min(2, t("family_name_error_min")),
		budget: z.number().min(1, t("budget_error_min")),
	})

	type SettingsFormValues = z.infer<typeof settingsSchema>

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: currentName || "",
			budget: currentBudget || 0,
		},
	})

	const { isDirty } = form.formState

	useEffect(() => {
		if (currentName) form.setValue("name", currentName)
		if (currentBudget) form.setValue("budget", currentBudget)
	}, [currentName, currentBudget, form])

	const onSubmit = async (values: SettingsFormValues) => {
		if (!householdId) return

		try {
			const { data } = await updateHousehold({
				variables: {
					id: householdId,
					input: {
						name: values.name,
						budget: values.budget,
					},
				},
			})

			if (data?.updateHousehold?.success) {
				dispatch(
					setHouseholdData({
						name: values.name,
						budget: values.budget,
					}),
				)
				toast.success(t("success_toast"))
			} else {
				toast.error(t("error_toast"))
			}
		} catch (error) {
			console.error("Update error:", error)
			toast.error(t("error_generic"))
		}
	}

	const handleDeleteAccount = async () => {
		if (deleteConfirmation !== "DELETE" || !householdId) return

		try {
			const { data } = await deleteHousehold({
				variables: { id: householdId },
			})

			if (data?.deleteHousehold?.success) {
				toast.success(t("account_deleted_success"))
				await signOut(auth)
				await logout()
				router.push("/login")
			} else {
				toast.error(t("account_delete_error"))
			}
		} catch (error) {
			console.error("Delete error:", error)
			toast.error(t("account_delete_generic_error"))
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-1">
					<Typography variant="h3">{t("title")}</Typography>

					<Typography variant="muted">{t("description")}</Typography>
				</div>

				<div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("family_name")}</FormLabel>

										<FormControl>
											<Input
												placeholder={t("family_name_placeholder")}
												{...field}
											/>
										</FormControl>

										<FormDescription>
											{t("family_name_description")}
										</FormDescription>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="budget"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("monthly_budget")}</FormLabel>

										<div className="space-y-4">
											<div className="flex items-center gap-4">
												<Typography
													as="span"
													variant="large"
													className="w-24 font-bold text-2xl"
												>
													€{field.value}
												</Typography>

												<Slider
													min={100}
													max={10000}
													step={50}
													value={[field.value]}
													onValueChange={(vals) => field.onChange(vals[0])}
													className="flex-1"
												/>
											</div>

											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
										</div>

										<FormDescription>{t("budget_description")}</FormDescription>

										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								disabled={loading || !isDirty}
								className="w-full"
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

								{loading ? t("saving") : t("save_changes")}
							</Button>
						</form>
					</Form>
				</div>
			</div>

			<div className="rounded-xl border border-destructive/20 bg-card p-4 shadow-sm">
				<div className="mb-4 space-y-1">
					<Typography variant="h4" className="font-medium text-red-500">
						{t("danger_zone_title")}
					</Typography>

					<Typography variant="muted">
						{t("danger_zone_description")}
					</Typography>
				</div>

				{!showDangerZone ? (
					<Button
						variant="ghost"
						aria-label={t("delete_account_button")}
						className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
						onClick={() => setShowDangerZone(true)}
					>
						<Trash2 className="mr-2 h-4 w-4" />

						{t("delete_account_button")}
					</Button>
				) : (
					<div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/10">
						<div className="space-y-1">
							<Typography
								variant="p"
								className="font-medium text-red-700 dark:text-red-400"
							>
								{t("delete_title")}
							</Typography>

							<Typography
								variant="muted"
								className="text-red-600/80 dark:text-red-400/80"
							>
								{t("delete_description")}
							</Typography>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="delete-input"
								className="text-red-700 dark:text-red-400"
							>
								{t("delete_confirmation_label")}
							</Label>

							<Input
								id="delete-input"
								value={deleteConfirmation}
								onChange={(e) => setDeleteConfirmation(e.target.value)}
								className="bg-white dark:bg-black"
							/>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row">
							<Button
								variant="destructive"
								disabled={deleteConfirmation !== "DELETE" || deleting}
								onClick={handleDeleteAccount}
								className="w-full sm:w-auto"
								aria-label={t("delete_button")}
							>
								{deleting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Trash2 className="mr-2 h-4 w-4" />
								)}

								{t("delete_button")}
							</Button>

							<Button
								variant="outline"
								onClick={() => {
									setShowDangerZone(false)

									setDeleteConfirmation("")
								}}
								className="w-full sm:w-auto"
							>
								{t("cancel_delete")}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
