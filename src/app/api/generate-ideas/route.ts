import { NextRequest, NextResponse } from "next/server";
import { IDEA_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { MOCK_IDEAS } from "@/lib/mock-data";
import { generateWithGemini } from "@/lib/gemini";
import { saveSession } from "@/lib/store";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      skills = [],
      interests = [],
      domains = [],
      teamSize = 1,
      weeks = 8,
      customSkills = "",
      customInterests = "",
      userId = "demo_student",
      userEmail = "demo_student@projectspark.dev",
      userName = "Demo Student",
    } = body;

    const userMessage = `
Student profile:
- Skills: ${[...skills, ...(customSkills ? customSkills.split(",").map((s: string) => s.trim()) : [])].join(", ")}
- Interests: ${[...interests, ...(customInterests ? customInterests.split(",").map((s: string) => s.trim()) : [])].join(", ")}
- Preferred domains: ${domains.join(", ")}
- Available time: ${weeks} weeks
- Team size: ${teamSize} ${teamSize === 1 ? "person (solo)" : "people"}

Generate 6 project ideas tailored to this profile. Return JSON only matching the schema.
    `.trim();

    let ideasJson: object;

    const apiKey = process.env.GEMINI_API_KEY || "";
    const isRealGeminiKey = apiKey && !apiKey.includes("AIzaSyD...");

    if (DEMO_MODE || !isRealGeminiKey) {
      // Demo mode / placeholder key: fast mock data
      await new Promise((r) => setTimeout(r, 1200));
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

    const session = await saveSession(userId, userEmail, userName, body, ideasJson);

    return NextResponse.json({ sessionId: session.id, ideas: ideasJson });
  } catch (error) {
    console.error("[generate-ideas]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
