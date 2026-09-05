import { NextRequest, NextResponse } from "next/server";
import { getPlan } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    const plan = await getPlan(planId);

    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
