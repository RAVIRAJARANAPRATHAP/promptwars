import { NextRequest, NextResponse } from "next/server";
import { IDEA_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { MOCK_IDEAS } from "@/lib/mock-data";
import { generateWithGemini } from "@/lib/gemini";
import { saveSession } from "@/lib/store";
import { validateIdeasInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    const validation = validateIdeasInput(rawBody);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid request payload" },
        { status: 400 }
      );
    }

    const {
      skills,
      interests,
      domains,
      teamSize,
      weeks,
      customSkills,
      customInterests,
      userId,
      userEmail,
      userName,
    } = validation.data;

    const allSkills = [...skills, ...(customSkills ? customSkills.split(",").map((s) => s.trim()).filter(Boolean) : [])];
    const allInterests = [...interests, ...(customInterests ? customInterests.split(",").map((s) => s.trim()).filter(Boolean) : [])];

    const userMessage = `
Student profile:
- Skills: ${allSkills.join(", ")}
- Interests: ${allInterests.length > 0 ? allInterests.join(", ") : "General Engineering"}
- Preferred domains: ${domains.length > 0 ? domains.join(", ") : "Web, Mobile, AI"}
- Available time: ${weeks} weeks
- Team size: ${teamSize} ${teamSize === 1 ? "person (solo)" : "people"}

Generate 6 project ideas tailored to this profile. Return JSON only matching the schema.
    `.trim();

    let ideasJson: object;

    const apiKey = process.env.GEMINI_API_KEY || "";
    const isRealGeminiKey = apiKey && !apiKey.includes("AIzaSyD...");

    if (DEMO_MODE || !isRealGeminiKey) {
      // Demo mode / placeholder key: fast mock data
      await new Promise((r) => setTimeout(r, 800));
      ideasJson = MOCK_IDEAS;
    } else {
      // Real Google Gemini API generation
      try {
        ideasJson = await generateWithGemini(IDEA_GENERATOR_SYSTEM_PROMPT, userMessage);
      } catch (geminiError) {
        console.warn("[generate-ideas] Gemini API call failed, falling back to mock:", geminiError);
        ideasJson = MOCK_IDEAS;
      }
    }

    const session = await saveSession(userId, userEmail, userName, validation.data, ideasJson);

    return NextResponse.json({ sessionId: session.id, ideas: ideasJson });
  } catch (error) {
    console.error("[generate-ideas]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating ideas. Please try again." },
      { status: 500 }
    );
  }
}
