import { server } from "@/mocks/server"
import "@testing-library/jest-dom"
import { afterAll, afterEach, beforeAll, vi } from "vitest"

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

vi.mock("next-intl", async (importOriginal) => {
	const actual = await importOriginal<typeof import("next-intl")>()

	return {
		...actual,

		useTranslations: () => (key: string) => {
			const messages = require("./src/messages/en.json")
			return messages.Auth?.[key] || key
		},
		useLocale: () => "en",
	}
})

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
}))

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

HTMLElement.prototype.setPointerCapture = vi.fn()
HTMLElement.prototype.releasePointerCapture = vi.fn()

const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = vi.fn((element) => {
	const style = originalGetComputedStyle(element)

	if (!style.transform) {
		Object.defineProperty(style, "transform", {
			value: "translate(0px, 0px)",
			writable: true,
		})
	}
	return style
})

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})
