import { Ghost, Home } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default async function NotFound() {
	const t = await getTranslations("NotFound")

	return (
		<div className="flex min-h-dvh items-center justify-center p-4">
			<div className="relative w-full max-w-md">
				{/* Background Glow Effect */}
				<div className="absolute -top-20 -left-20 h-64 w-64 animate-pulse rounded-full bg-primary/30 opacity-50 blur-3xl" />
				<div className="absolute -right-20 -bottom-20 h-64 w-64 animate-pulse rounded-full bg-purple-500/30 opacity-50 blur-3xl delay-700" />

				{/* Glassmorphism Card */}
				<div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-8 text-center shadow-2xl backdrop-blur-xl">
					<div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-white/10 to-transparent" />

					<div className="mb-6 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
							<Ghost className="relative z-10 h-20 w-20 animate-bounce text-primary" />
						</div>
					</div>

					<Typography
						variant="h1"
						className="mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-6xl text-transparent"
					>
						404
					</Typography>

					<Typography variant="h2" className="mb-3 font-semibold text-2xl">
						{t("title")}
					</Typography>

					<Typography variant="muted" className="mx-auto mb-8 max-w-xs text-lg">
						{t("description")}
					</Typography>

					<Button
						asChild
						size="lg"
						className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary/90"
					>
						<Link href="/" className="flex items-center gap-2">
							<Home className="h-4 w-4" />
							{t("button")}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
