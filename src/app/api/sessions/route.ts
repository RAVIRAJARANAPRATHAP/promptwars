import { NextRequest, NextResponse } from "next/server";
import { getUserSessions } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo_student";
    const sessions = await getUserSessions(userId);

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
