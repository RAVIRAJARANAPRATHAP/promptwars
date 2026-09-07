import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Supported production Gemini models with automatic failover
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash"];

/**
 * Strips markdown code blocks (e.g. ```json ... ```) from model output and parses JSON safely.
 */
function cleanAndParseJSON(rawText: string): Record<string, unknown> {
  const cleaned = rawText
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function generateWithGemini(
  systemInstruction: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  if (!genAI || !apiKey || apiKey.startsWith("AIzaSyD...")) {
    throw new Error("GEMINI_API_KEY is not configured or is a placeholder");
  }

  let lastError: unknown = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed, trying next fallback:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content.");
}
