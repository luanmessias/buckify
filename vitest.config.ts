import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**/*.tsx", "src/**/*.ts"],
			exclude: [
				"src/components/ui/**",
				"**/*.d.rs",
				"**/*.test.tsx",
				"src/middleware.ts",
			],
		},
	},
})
