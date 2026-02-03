import { fireEvent, render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, it, vi } from "vitest"
import messages from "@/messages/en.json"
import { UserArea } from "./user-area"

vi.mock("@/lib/hooks", () => ({
	useAppSelector: vi.fn(),
}))

vi.mock("@/components/common/theme-toggle/theme-toggle", () => ({
	ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

vi.mock("@/components/features/auth/logout-button/logout-button", () => ({
	LogoutButton: () => <div data-testid="logout-button">LogoutButton</div>,
}))

vi.mock("../user-settings/user-settings", () => ({
	UserSettings: () => <div data-testid="user-settings">UserSettings</div>,
}))

vi.mock("@/components/ui/avatar", () => ({
	Avatar: ({ children, className }: any) => (
		<div className={className}>{children}</div>
	),
	AvatarImage: ({ src, alt, className }: any) => (
		<img src={src} alt={alt} className={className} />
	),
	AvatarFallback: ({ children, className }: any) => (
		<div className={className}>{children}</div>
	),
}))

import { useAppSelector } from "@/lib/hooks"

describe("UserArea Component", () => {
	const mockUser = {
		name: "John Doe",
		email: "john@example.com",
		photoURL: "https://example.com/photo.jpg",
	}

	beforeEach(() => {
		vi.mocked(useAppSelector).mockReturnValue(mockUser)
	})

	it("should render user avatar with photo", () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<UserArea />
			</NextIntlClientProvider>,
		)

		const avatarImage = screen.getByRole("img", { name: "John Doe" })
		expect(avatarImage).toBeInTheDocument()
		expect(avatarImage).toHaveAttribute("src", mockUser.photoURL)
	})

	it("should render initials when no photo is available", () => {
		vi.mocked(useAppSelector).mockReturnValue({
			...mockUser,
			photoURL: null,
		})

		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<UserArea />
			</NextIntlClientProvider>,
		)

		expect(screen.getByText("JD")).toBeInTheDocument()
	})

	it("should open sheet and display user info when clicked", async () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<UserArea />
			</NextIntlClientProvider>,
		)

		const triggerButton = screen.getByTestId("user-area-trigger-button")
		fireEvent.click(triggerButton)

		expect(await screen.findByText("John Doe")).toBeInTheDocument()
		expect(screen.getByText("john@example.com")).toBeInTheDocument()
	})

	it("should render internal components inside the sheet", async () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<UserArea />
			</NextIntlClientProvider>,
		)

		const triggerButton = screen.getByTestId("user-area-trigger-button")
		fireEvent.click(triggerButton)

		expect(await screen.findByTestId("theme-toggle")).toBeInTheDocument()
		expect(screen.getByTestId("logout-button")).toBeInTheDocument()
		expect(screen.getByTestId("user-settings")).toBeInTheDocument()
	})
})
