export const generateFixCommentsPrompt = (code: string) => {
	return `
    You are a Senior TypeScript Developer specialized in Code Cleanup.
    
    TASK:
    Remove all "casual" comments from the provided code, but KEEP specific technical comments.
    
    RULES:
    1. REMOVE: All comments starting with // or /* that are just chatting, commented-out code, or obvious statements.
    2. KEEP: All comments containing "TODO", "FIXME", "WARNING", "NOTE", "eslint-disable", "biome-ignore", or "@ts-ignore".
    3. KEEP: JSDoc comments (/** ... */) that describe functions or classes.
    4. CRITICAL: Do NOT change a single character of the actual code logic, indentation, or imports. Return the code EXACTLY as is, just without the forbidden comments.
    5. OUTPUT: Return ONLY the raw code string. No markdown blocks, no explanations.

    CODE TO CLEAN:
    ${code}
  `
}
