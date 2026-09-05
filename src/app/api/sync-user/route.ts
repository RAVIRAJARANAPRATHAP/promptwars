import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, name } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("USER:PASSWORD@HOST/DATABASE")) {
      try {
        const user = await prisma.user.upsert({
          where: { clerkId: uid },
          update: { email: email || `${uid}@firebase.com`, name: name || null },
          create: { clerkId: uid, email: email || `${uid}@firebase.com`, name: name || null },
        });
        return NextResponse.json({ user });
      } catch (dbError) {
        console.warn("[sync-user] Database sync fallback:", dbError);
      }
    }

    return NextResponse.json({ success: true, uid, email, name });
  } catch (error) {
    console.error("[sync-user]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
