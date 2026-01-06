export const generateTranslationPrompt = (
	masterLangCode: string,
	targetLang: string,
	payload: unknown,
) => {
	return `
    You are a professional translator for a Finance App. 
    Translate the values of the following JSON from '${masterLangCode}' to '${targetLang}'.
    
    Rules:
    1. Keep the JSON structure and keys EXACTLY the same.
    2. Only translate the values (strings).
    3. Do not add any explanation, only return the valid JSON string.
    4. If a value is a currency symbol (like R$, €, $) adapt it to the target language currency ONLY IF usually localized, otherwise keep it logical.
    
    JSON to translate:
    ${JSON.stringify(payload, null, 2)}
  `
}
