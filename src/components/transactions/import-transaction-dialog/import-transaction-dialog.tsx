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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
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

export function ImportTransactionDialog({
	isOpen,
	onClose,
	onConfirm,
	isSubmitting = false,
}: ImportTransactionDialogProps) {
	const t = useTranslations("Transactions")
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

	const handleClose = () => {
		setStep("upload")
		setTransactions([])
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="w-full rounded-2xl max-w-[calc(100%-2rem)] max-h-[85vh] flex flex-col">
				<div className="absolute right-0 top-0 w-70 h-70 bg-linear-to-br from-primary/10 to-transparent opacity-30 rounded-bl-full pointer-events-none" />
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UploadCloud className="w-5 h-5 text-primary" />
						{t("import_title")}
					</DialogTitle>
					<DialogDescription className="text-left flex flex-col gap-1">
						<span>{t("send_image_pdf")}</span>
						<span>{t("expenses_categorized")}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-hidden p-1">
					{step === "upload" ? (
						<button
							className="border-2 w-full border-dashed border-muted-foreground/25 rounded-xl h-64 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer bg-transparent"
							onClick={() => !isAnalyzing && fileInputRef.current?.click()}
							disabled={isAnalyzing}
							type="button"
						>
							{isAnalyzing ? (
								<div className="flex flex-col items-center gap-2 animate-pulse">
									<Loader2 className="w-10 h-10 text-primary animate-spin" />
									<Typography variant="muted">
										{t("reading_transactions")}
									</Typography>
								</div>
							) : (
								<>
									<div className="p-4 bg-muted rounded-full">
										<FileText className="w-8 h-8 text-muted-foreground" />
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
						<ScrollArea className="h-100">
							<div className="space-y-3">
								<div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
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
										className={`
											flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border animate-in fade-in slide-in-from-bottom-2
											${
												item.isPossibleDuplicate
													? "bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/30"
													: "bg-card border-input"
											}
										`}
									>
										<div className="flex justify-between items-center flex-1 min-w-0">
											<div className="flex items-center gap-2">
												{item.isPossibleDuplicate && (
													<TooltipProvider>
														<Tooltip delayDuration={0}>
															<TooltipTrigger asChild>
																<div className="cursor-help text-amber-500 hover:text-amber-400 transition-colors">
																	<AlertTriangle className="w-4 h-4" />
																</div>
															</TooltipTrigger>
															<TooltipContent className="bg-amber-950 border-amber-800 text-amber-100 font-medium text-xs">
																<p>{t("possible_duplicate")}</p>
																<p className="opacity-80 font-normal">
																	{t("duplicate_description")}
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
												<p className="font-medium truncate text-sm">
													{item.description}
												</p>
											</div>
											<p className="text-xs text-muted-foreground">
												{item.date}
											</p>
										</div>

										<div className="w-full flex items-center justify-between gap-2">
											<div className="relative">
												<select
													className="h-8 w-auto appearance-none rounded border border-input bg-background pl-3 pr-8 text-xs focus:ring-1 focus:ring-primary cursor-pointer"
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

												<ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none opacity-70" />
											</div>

											<div className="flex items-center gap-2">
												<Typography
													as="div"
													className="font-mono font-medium w-20 text-right"
												>
													€{item.amount.toFixed(2)}
												</Typography>

												<Button
													variant="ghost"
													disabled={isSubmitting}
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
													onClick={() => handleRemoveItem(idx)}
												>
													<X className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</div>

				{step === "review" && (
					<div className="pt-4 border-t flex gap-2 justify-end">
						<Button
							variant="outline"
							disabled={isSubmitting}
							onClick={handleClose}
						>
							{t("cancel")}
						</Button>
						<Button
							disabled={isSubmitting}
							onClick={() => {
								onConfirm(transactions)
							}}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{t("saving")}
								</>
							) : (
								<>
									<Check className="w-4 h-4 mr-2" />
									{t("confirm_import")}
								</>
							)}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
