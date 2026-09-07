import { NextRequest, NextResponse } from "next/server";
import { IDEA_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { generateWithGemini } from "@/lib/gemini";
import { saveSession } from "@/lib/store";
import { validateIdeasInput } from "@/lib/validation";
import { normalizeIdeasJson, generateDynamicFallbackIdeas } from "@/lib/normalizers";

export const dynamic = "force-dynamic";

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

    const allSkills = [
      ...skills,
      ...(customSkills ? customSkills.split(",").map((s) => s.trim()).filter(Boolean) : []),
    ];
    const allInterests = [
      ...interests,
      ...(customInterests ? customInterests.split(",").map((s) => s.trim()).filter(Boolean) : []),
    ];

    const userMessage = `
Student profile:
- Skills: ${allSkills.join(", ")}
- Interests: ${allInterests.length > 0 ? allInterests.join(", ") : "General Engineering"}
- Preferred domains: ${domains.length > 0 ? domains.join(", ") : "Web, Mobile, AI"}
- Available time: ${weeks} weeks
- Team size: ${teamSize} ${teamSize === 1 ? "person (solo)" : "people"}

Generate 6 project ideas strictly tailored to this profile. Return JSON only matching the schema.
    `.trim();

    let ideasJson: object;

    const apiKey = process.env.GEMINI_API_KEY || "";
    const hasValidKey = apiKey && !apiKey.includes("AIzaSyD...");

    if (hasValidKey) {
      try {
        const rawAiResult = await generateWithGemini(IDEA_GENERATOR_SYSTEM_PROMPT, userMessage);
        ideasJson = normalizeIdeasJson(rawAiResult, validation.data);
      } catch (geminiError) {
        console.warn("[generate-ideas] Gemini call failed, generating dynamic fallback ideas:", geminiError);
        ideasJson = generateDynamicFallbackIdeas(validation.data);
      }
    } else {
      // If no API key configured, generate dynamic algorithmic ideas strictly from the user's input
      ideasJson = generateDynamicFallbackIdeas(validation.data);
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
