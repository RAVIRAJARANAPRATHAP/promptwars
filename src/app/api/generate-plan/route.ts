import { NextRequest, NextResponse } from "next/server";
import { ROADMAP_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { MOCK_PLAN } from "@/lib/mock-data";
import { generateWithGemini } from "@/lib/gemini";
import { savePlan } from "@/lib/store";
import { validatePlanInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    const validation = validatePlanInput(rawBody);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid request payload" },
        { status: 400 }
      );
    }

    const { sessionId, ideaIndex, ideaTitle, ideaPitch, skills, weeks } = validation.data;

    const userMessage = `
Student profile:
- Skills: ${Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "General Engineering"}
- Available time: ${weeks} weeks

Chosen idea:
- Title: ${ideaTitle}
- Pitch: ${ideaPitch}

Generate a detailed build roadmap for this project. Return JSON only matching the schema.
    `.trim();

    let planJson: object;

    const apiKey = process.env.GEMINI_API_KEY || "";
    const isRealGeminiKey = apiKey && !apiKey.includes("AIzaSyD...");

    if (DEMO_MODE || !isRealGeminiKey) {
      await new Promise((r) => setTimeout(r, 800));
      planJson = MOCK_PLAN;
    } else {
      try {
        planJson = await generateWithGemini(ROADMAP_GENERATOR_SYSTEM_PROMPT, userMessage);
      } catch (geminiError) {
        console.warn("[generate-plan] Gemini API call failed, falling back to mock:", geminiError);
        planJson = MOCK_PLAN;
      }
    }

    const plan = await savePlan(sessionId, ideaTitle, ideaIndex, planJson);

    return NextResponse.json({ planId: plan.id, plan: planJson });
  } catch (error) {
    console.error("[generate-plan]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating the roadmap plan." },
      { status: 500 }
    );
  }
}
