"use client"

import { Save, Tag } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import { IconPicker } from "@/components/ui/icon-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { Category } from "@/lib/types"

interface UpdateCategoryDrawerProps {
	isOpen: boolean
	onClose: () => void
	category: Category
	onUpdate: (
		id: string,
		data: {
			name: string
			budget: number
			icon: string
			description?: string
			color?: string
		},
	) => Promise<void>
	isSubmitting?: boolean
}

export const UpdateCategoryDrawer = ({
	isOpen,
	onClose,
	category,
	onUpdate,
	isSubmitting = false,
}: UpdateCategoryDrawerProps) => {
	const t = useTranslations("Category")

	const [name, setName] = useState(category?.name || "")
	const [budget, setBudget] = useState(category?.budget || 0)
	const [icon, setIcon] = useState(category?.icon || "circle-dashed")

	useEffect(() => {
		if (category && isOpen) {
			setName(category.name)
			setBudget(category.budget)
			setIcon(category.icon || "circle-dashed")
		}
	}, [category, isOpen])

	const handleSliderChange = (value: number[]) => {
		setBudget(value[0])
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose()
	}

	const handleSave = async () => {
		if (!category) return
		await onUpdate(category.id, {
			name,
			budget,
			icon,
			description: category.description,
			color: category.color,
		})
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<Tag className="h-5 w-5 text-primary" />
						{t("edit_category")}
					</DrawerTitle>
					<DrawerDescription className="text-left">
						{t("edit_category_description")}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 space-y-8 overflow-hidden p-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">{t("category_name")}</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="h-10 border-border/50 bg-muted/20 transition-all focus:bg-background"
								placeholder={t("name_placeholder")}
							/>
						</div>

						<div className="space-y-2">
							<Label>{t("icon")}</Label>
							<div className="w-full">
								<IconPicker
									value={icon}
									onChange={setIcon}
									className="h-10 border-border/50 bg-muted/20 transition-all hover:bg-muted/20 focus:bg-background"
								/>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-end justify-between">
							<Label htmlFor="budget">{t("monthly_budget")}</Label>

							<div className="flex items-center gap-1 border-border/50 border-b transition-colors focus-within:border-primary">
								<span className="text-muted-foreground text-sm">
									{t("currency_symbol")}
								</span>
								<input
									type="number"
									value={budget}
									onChange={(e) => setBudget(Number(e.target.value))}
									className="w-16 bg-transparent text-right font-bold font-mono text-lg focus:outline-none"
								/>
							</div>
						</div>

						<Slider
							defaultValue={[budget]}
							value={[budget]}
							max={3000}
							step={10}
							onValueChange={handleSliderChange}
							className="py-4"
						/>
						<p className="text-center text-[10px] text-muted-foreground/60">
							{t("budget_hint_text", {
								defaultMessage: "Adjusting recalculates remaining balance",
							})}
						</p>
					</div>

					<Button
						onClick={handleSave}
						disabled={isSubmitting}
						className="h-11 w-full gap-2 font-semibold text-base shadow-lg shadow-primary/20"
					>
						<Save className="h-4 w-4" />
						{t("save_changes")}
					</Button>
				</div>

				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
