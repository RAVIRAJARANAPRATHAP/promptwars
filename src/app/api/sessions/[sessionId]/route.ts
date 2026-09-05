import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await getSession(sessionId);

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
