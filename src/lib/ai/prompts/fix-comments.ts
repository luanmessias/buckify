export const generateFixCommentsPrompt = (code: string) => {
	return `
    You are a Strict Code Cleaner.
    
    TASK:
    Aggressively remove comments from the provided code to make it clean and minimal.
    
    RULES:
    1. REMOVE: ALL standard comments (// or /* ... */). This includes:
       - Section separators (e.g., "--- BASE ---").
       - Explanations of code logic or design decisions (e.g., "Used for background...").
       - Commented-out code.
       - "Chatting" or notes to self.
    
    2. EXCEPTION (KEEP): You MUST ONLY keep comments that explicitly contain these tags:
       - "TODO"
       - "FIXME"
       - "WARNING"
       - "NOTE"
       - "eslint-disable"
       - "biome-ignore"
       - "@ts-ignore"
       
    3. EXCEPTION (KEEP): Keep valid JSDoc comments (starting with /**) ONLY if they are documenting a function, class, or interface. If it is a standard comment block (starting with /*), REMOVE IT.

    4. CRITICAL: Do NOT change a single character of the actual code logic, CSS values, indentation, or imports. Return the code EXACTLY as is, just without the forbidden comments.
    5. OUTPUT: Return ONLY the raw code string. No markdown blocks, no explanations.

    CODE TO CLEAN:
    ${code}
  `
}
