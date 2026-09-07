import { NextRequest, NextResponse } from "next/server";
import { ROADMAP_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { generateWithGemini } from "@/lib/gemini";
import { savePlan } from "@/lib/store";
import { validatePlanInput } from "@/lib/validation";
import { normalizePlanJson } from "@/lib/normalizers";

export const dynamic = "force-dynamic";

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
    const hasValidKey = apiKey && !apiKey.includes("AIzaSyD...");

    if (hasValidKey) {
      try {
        const rawAiResult = await generateWithGemini(ROADMAP_GENERATOR_SYSTEM_PROMPT, userMessage);
        planJson = normalizePlanJson(rawAiResult, validation.data);
      } catch (geminiError) {
        console.warn("[generate-plan] Gemini API call failed, generating tailored fallback plan:", geminiError);
        planJson = normalizePlanJson(null, validation.data);
      }
    } else {
      planJson = normalizePlanJson(null, validation.data);
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
