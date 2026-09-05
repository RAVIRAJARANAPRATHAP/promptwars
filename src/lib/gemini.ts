import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateWithGemini(
  systemInstruction: string,
  userPrompt: string
): Promise<any> {
  if (!genAI || !apiKey || apiKey.startsWith("AIzaSyD...")) {
    throw new Error("GEMINI_API_KEY is not configured or is a placeholder");
  }

  // Use gemini-1.5-flash which is fast, reliable, and supports systemInstruction + responseMimeType
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  return JSON.parse(text);
}
