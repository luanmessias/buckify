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
	}
})

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

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
