import tsParser from "@typescript-eslint/parser"
import i18next from "eslint-plugin-i18next"

export default [
	{
		files: ["src/**/*.{ts,tsx}"],
		ignores: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			i18next: i18next,
		},
		rules: {
			"i18next/no-literal-string": [
				"warn",
				{
					markupOnly: true,
					ignoreAttribute: [
						"data-testid",
						"className",
						"to",
						"href",
						"asChild",
						"variant",
						"size",
						"align",
						"justify",
						"key",
					],
				},
			],

			"no-restricted-syntax": [
				"error",
				{
					selector:
						"JSXElement[openingElement.name.name=/^(div|span|p|section|article|li)$/] > JSXText[value=/\\S/]",
					message:
						"Texto puro não é permitido dentro de tags nativas. Use o componente <Typography> ou traduza o texto.",
				},
			],
		},
	},
	{
		ignores: [
			".next/*",
			"node_modules/*",
			"dist/*",
			"coverage/*",
			"src/@types/*",
		],
	},
]
