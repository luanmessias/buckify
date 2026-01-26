"use client"

import {
	AlertTriangle,
	Check,
	ChevronDown,
	FileText,
	Loader2,
	UploadCloud,
	X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { scanBankStatement } from "@/actions/scan-statement"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { useAppSelector } from "@/lib/hooks"
import type { ScannedTransaction } from "@/lib/types"

interface TransactionDraft {
	id: string
	date: string
	description: string
	amount: number
	categoryId: string
	isPossibleDuplicate?: boolean
}

interface ScanBankStatementResult {
	success: boolean
	data?: ScannedTransaction[]
	categories?: { id: string; name: string }[]
	error?: string
}

interface ImportTransactionDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (transactions: TransactionDraft[]) => void
	isSubmitting?: boolean
}

export const ImportTransactionDrawer = ({
	isOpen,
	onClose,
	onConfirm,
	isSubmitting = false,
}: ImportTransactionDialogProps) => {
	const t = useTranslations("Transactions")
	const tCommon = useTranslations("Common")
	const categories = useAppSelector((state) => state.categories.items)
	const [step, setStep] = useState<"upload" | "review">("upload")
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [transactions, setTransactions] = useState<TransactionDraft[]>([])

	useEffect(() => {
		if (!isOpen) {
			const timer = setTimeout(() => {
				setStep("upload")
				setTransactions([])
				setIsAnalyzing(false)
			}, 300)

			return () => clearTimeout(timer)
		}
	}, [isOpen])

	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (file.size > 4 * 1024 * 1024) {
			toast.error(t("file_too_large"))
			return
		}

		setIsAnalyzing(true)
		const formData = new FormData()
		formData.append("file", file)

		const result: ScanBankStatementResult = await scanBankStatement(formData)

		if (result.success && result.data) {
			const transactionsWithIds = result.data.map((t) => ({
				...t,
				id: Math.random().toString(36).substr(2, 9),
			}))
			setTransactions(transactionsWithIds)
			setStep("review")
			toast.success(t("transactions_found", { count: result.data.length }))
		} else {
			toast.error(result.error || t("error_parsing_statement"))
		}

		setIsAnalyzing(false)
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	const handleRemoveItem = (index: number) => {
		setTransactions((prev) => prev.filter((_, i) => i !== index))
	}

	const handleCategoryChange = (index: number, newCategory: string) => {
		setTransactions((prev) => {
			const newItems = [...prev]
			newItems[index].categoryId = newCategory
			return newItems
		})
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setStep("upload")
			setTransactions([])
			onClose()
		}
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90vh]">
				<div className="pointer-events-none absolute top-0 right-0 h-70 w-70 rounded-bl-full bg-linear-to-br from-primary/10 to-transparent opacity-30" />
				<DrawerHeader>
					<DrawerTitle className="flex items-center gap-2">
						<UploadCloud className="h-5 w-5 text-primary" />
						{t("import_title")}
					</DrawerTitle>
					<DrawerDescription className="flex flex-col gap-1 text-left">
						<span>{t("send_image_pdf")}</span>
						<span>{t("expenses_categorized")}</span>
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-hidden p-4">
					{step === "upload" ? (
						<button
							className="flex h-64 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-muted-foreground/25 border-dashed bg-transparent transition-colors hover:bg-muted/50"
							onClick={() => !isAnalyzing && fileInputRef.current?.click()}
							disabled={isAnalyzing}
							type="button"
						>
							{isAnalyzing ? (
								<div className="flex animate-pulse flex-col items-center gap-2">
									<Loader2 className="h-10 w-10 animate-spin text-primary" />
									<Typography variant="muted">
										{t("reading_transactions")}
									</Typography>
								</div>
							) : (
								<>
									<div className="rounded-full bg-muted p-4">
										<FileText className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="text-center">
										<Typography variant="p" className="font-medium">
											{t("click_to_upload")}
										</Typography>
										<Typography variant="muted" className="text-xs">
											{t("supported_formats")}
										</Typography>
									</div>
								</>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*,application/pdf"
								className="hidden"
								onChange={handleFileUpload}
								disabled={isAnalyzing}
							/>
						</button>
					) : (
						<ScrollArea className="h-[50vh]">
							<div className="space-y-3">
								<div className="mb-4 flex items-center justify-between text-muted-foreground text-sm">
									<span>
										{t("expenses_found", { count: transactions.length })}
									</span>
									<Button
										variant="ghost"
										size="sm"
										disabled={isSubmitting}
										onClick={() => setStep("upload")}
									>
										{t("back")}
									</Button>
								</div>

								{transactions.map((item, idx) => (
									<div
										key={item.id}
										className={`fade-in flex animate-in flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center slide-in-from-bottom-2${
											item.isPossibleDuplicate
												? "border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/30"
												: "border-input bg-card"
										}
										`}
									>
										<div className="flex min-w-0 flex-1 items-center justify-between">
											<div className="flex items-center gap-2">
												{item.isPossibleDuplicate && (
													<TooltipProvider>
														<Tooltip delayDuration={0}>
															<TooltipTrigger asChild>
																<div className="cursor-help text-amber-500 transition-colors hover:text-amber-400">
																	<AlertTriangle className="h-4 w-4" />
																</div>
															</TooltipTrigger>
															<TooltipContent className="border-amber-800 bg-amber-950 font-medium text-amber-100 text-xs">
																<p>{t("possible_duplicate")}</p>
																<p className="font-normal opacity-80">
																	{t("duplicate_description")}
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
												<p className="truncate font-medium text-sm">
													{item.description}
												</p>
											</div>
											<p className="text-muted-foreground text-xs">
												{item.date}
											</p>
										</div>

										<div className="flex w-full items-center justify-between gap-2">
											<div className="relative">
												<select
													className="h-8 w-auto cursor-pointer appearance-none rounded border border-input bg-background pr-8 pl-3 text-xs focus:ring-1 focus:ring-primary"
													value={item.categoryId}
													disabled={isSubmitting}
													onChange={(e) =>
														handleCategoryChange(idx, e.target.value)
													}
												>
													<option value="others">{t("others")}</option>
													{categories.map((c) => (
														<option key={c.id} value={c.id}>
															{c.name}
														</option>
													))}
												</select>

												<ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-70" />
											</div>

											<div className="flex items-center gap-2">
												<Typography
													as="div"
													className="w-20 text-right font-medium font-mono"
												>
													€{item.amount.toFixed(2)}
												</Typography>

												<Button
													variant="ghost"
													disabled={isSubmitting}
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
													onClick={() => handleRemoveItem(idx)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</div>

				<DrawerFooter className="pt-2">
					{step === "review" ? (
						<div className="flex w-full gap-2">
							<Button
								variant="outline"
								className="flex-1"
								disabled={isSubmitting}
								onClick={() => handleOpenChange(false)}
							>
								{t("cancel")}
							</Button>
							<Button
								className="flex-1"
								disabled={isSubmitting}
								onClick={() => {
									onConfirm(transactions)
								}}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{t("saving")}
									</>
								) : (
									<>
										<Check className="mr-2 h-4 w-4" />
										{t("confirm_import")}
									</>
								)}
							</Button>
						</div>
					) : (
						<DrawerClose asChild>
							<Button variant="outline">{tCommon("close")}</Button>
						</DrawerClose>
					)}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
