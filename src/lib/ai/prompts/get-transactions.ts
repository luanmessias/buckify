interface CategoryContext {
	id: string
	name: string
	keywords?: string[]
}

export const generateBankStatementPrompt = (categories: CategoryContext[]) => {
	const categoriesList = categories
		.map((c) => `- ID: "${c.id}" (Name: "${c.name}")`)
		.join("\n")

	return `
    You are an expert financial assistant specialized in parsing bank statements.
    
    OBJECTIVE: Analyze the provided image/PDF and extract a list of EXPENSES.

    STRICT RULES:
    1. IGNORE deposits, incoming transfers, or positive values. Extract ONLY outflows/expenses.
    2. AMOUNT: Convert negative values (e.g., -12.50) to absolute positive numbers (12.50).
    3. DATE: Format as YYYY-MM-DD. If the year is missing, assume the current year.
    4. DESCRIPTION: Clean up the text (remove bank codes, keep the merchant name).
    5. CATEGORIZATION: Map each transaction to ONE of the following Category IDs based on the description. If unsure, use "others".
    
    AVAILABLE CATEGORIES:
    ${categoriesList}
    - ID: "others" (Name: "Outros/Não categorizado")

    RETURN FORMAT:
    Return ONLY a raw JSON Array (no markdown, no code blocks).
    Example:
    [
      { "date": "2024-01-20", "description": "Uber Trip", "amount": 15.90, "categoryId": "transport_id" }
    ]
  `
}
