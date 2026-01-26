import { useTranslations } from "next-intl"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"

export const UserArea = () => {
	const t = useTranslations("UserArea")

	return (
		<Sheet>
			<SheetTrigger>{t("open_button")}</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{t("logout_title")}</SheetTitle>
					<SheetDescription>{t("logout_description")}</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
