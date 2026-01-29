"use client"

import { User as UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ThemeToggle } from "@/components/common/theme-toggle/theme-toggle"
import { LogoutButton } from "@/components/features/auth/logout-button/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { useAppSelector } from "@/lib/hooks"
import { UserSettings } from "../user-settings/user-settings"

export const UserArea = () => {
	const t = useTranslations("UserArea")

	const { name, photoURL, email } = useAppSelector((state) => state.user)

	const initials = name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					type="button"
					className="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				>
					<Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2 ring-offset-background">
						<AvatarImage
							src={photoURL || ""}
							alt={name || "User Avatar"}
							referrerPolicy="no-referrer"
						/>

						<AvatarFallback className="bg-muted font-medium text-muted-foreground">
							{initials || <UserIcon className="h-4 w-4" />}
						</AvatarFallback>
					</Avatar>
				</button>
			</SheetTrigger>

			<SheetContent side="right" className="flex h-full flex-col">
				<SheetHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
					<Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2 ring-offset-background">
						<AvatarImage
							src={photoURL || ""}
							alt={name || "User Avatar"}
							referrerPolicy="no-referrer"
						/>
						<AvatarFallback className="bg-muted font-medium text-lg text-muted-foreground">
							{initials || <UserIcon className="h-5 w-5" />}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col text-left">
						<SheetTitle>{name || t("header_title")}</SheetTitle>
						<SheetDescription>{email}</SheetDescription>
					</div>
				</SheetHeader>

				<ScrollArea className="-mr-6 flex-1 pr-6">
					<div className="mt-6 mb-6 flex items-center gap-3">
						<ThemeToggle variant="outline" size="default" className="flex-1" />
						<LogoutButton variant="outline" size="default" className="flex-1" />
					</div>

					<div className="pb-6">
						<UserSettings />
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
