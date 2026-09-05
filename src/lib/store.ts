import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface StoredSession {
  id: string;
  userId: string;
  inputJson: any;
  ideasJson: any;
  createdAt: Date;
  projectPlans?: StoredPlan[];
}

export interface StoredPlan {
  id: string;
  ideaSessionId: string;
  ideaTitle: string;
  ideaIndex: number;
  planJson: any;
  createdAt: Date;
}

// Global in-memory storage fallback for demo mode & unconfigured DB
const memorySessions = new Map<string, StoredSession>();
const memoryPlans = new Map<string, StoredPlan>();

function isPrismaConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("USER:PASSWORD") || url.includes("@HOST/") || url.includes("HOST")) return false;
  return true;
}

export async function saveSession(
  userId: string,
  email: string,
  name: string | null,
  inputJson: any,
  ideasJson: any
): Promise<StoredSession> {
  if (isPrismaConfigured()) {
    try {
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: { email, name },
        create: { clerkId: userId, email, name },
      });

      const session = await prisma.ideaSession.create({
        data: {
          userId: user.id,
          inputJson,
          ideasJson,
        },
      });

      return {
        id: session.id,
        userId: session.userId,
        inputJson: session.inputJson,
        ideasJson: session.ideasJson,
        createdAt: session.createdAt,
      };
    } catch (e) {
      console.warn("[store] Prisma DB failed, falling back to memory store:", e);
    }
  }

  // Memory fallback
  const id = "sess_" + crypto.randomUUID().slice(0, 12);
  const session: StoredSession = {
    id,
    userId,
    inputJson,
    ideasJson,
    createdAt: new Date(),
    projectPlans: [],
  };
  memorySessions.set(id, session);
  return session;
}

export async function getSession(sessionId: string): Promise<StoredSession | null> {
  if (isPrismaConfigured()) {
    try {
      const session = await prisma.ideaSession.findUnique({
        where: { id: sessionId },
        include: { projectPlans: true },
      });
      if (session) {
        return {
          id: session.id,
          userId: session.userId,
          inputJson: session.inputJson,
          ideasJson: session.ideasJson,
          createdAt: session.createdAt,
          projectPlans: session.projectPlans.map((p) => ({
            id: p.id,
            ideaSessionId: p.ideaSessionId,
            ideaTitle: p.ideaTitle,
            ideaIndex: p.ideaIndex,
            planJson: p.planJson,
            createdAt: p.createdAt,
          })),
        };
      }
    } catch (e) {
      console.warn("[store] Prisma getSession failed, falling back to memory:", e);
    }
  }

  const mem = memorySessions.get(sessionId);
  if (mem) {
    const plans = Array.from(memoryPlans.values()).filter((p) => p.ideaSessionId === sessionId);
    return { ...mem, projectPlans: plans };
  }
  return null;
}

export async function savePlan(
  sessionId: string,
  ideaTitle: string,
  ideaIndex: number,
  planJson: any
): Promise<StoredPlan> {
  if (isPrismaConfigured()) {
    try {
      const plan = await prisma.projectPlan.create({
        data: {
          ideaSessionId: sessionId,
          ideaTitle,
          ideaIndex,
          planJson,
        },
      });
      return {
        id: plan.id,
        ideaSessionId: plan.ideaSessionId,
        ideaTitle: plan.ideaTitle,
        ideaIndex: plan.ideaIndex,
        planJson: plan.planJson,
        createdAt: plan.createdAt,
      };
    } catch (e) {
      console.warn("[store] Prisma savePlan failed, falling back to memory:", e);
    }
  }

  const id = "plan_" + crypto.randomUUID().slice(0, 12);
  const plan: StoredPlan = {
    id,
    ideaSessionId: sessionId,
    ideaTitle,
    ideaIndex,
    planJson,
    createdAt: new Date(),
  };
  memoryPlans.set(id, plan);

  // Link to memory session if present
  const session = memorySessions.get(sessionId);
  if (session) {
    if (!session.projectPlans) session.projectPlans = [];
    session.projectPlans.push(plan);
  }

  return plan;
}

export async function getPlan(planId: string): Promise<StoredPlan | null> {
  if (isPrismaConfigured()) {
    try {
      const plan = await prisma.projectPlan.findUnique({
        where: { id: planId },
      });
      if (plan) {
        return {
          id: plan.id,
          ideaSessionId: plan.ideaSessionId,
          ideaTitle: plan.ideaTitle,
          ideaIndex: plan.ideaIndex,
          planJson: plan.planJson,
          createdAt: plan.createdAt,
        };
      }
    } catch (e) {
      console.warn("[store] Prisma getPlan failed, falling back to memory:", e);
    }
  }

  return memoryPlans.get(planId) || null;
}

export async function getUserSessions(userId: string): Promise<StoredSession[]> {
  if (isPrismaConfigured()) {
    try {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        const sessions = await prisma.ideaSession.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: { projectPlans: { select: { id: true, ideaTitle: true, createdAt: true } } },
        });
        return sessions.map((s) => ({
          id: s.id,
          userId: s.userId,
          inputJson: s.inputJson,
          ideasJson: s.ideasJson,
          createdAt: s.createdAt,
          projectPlans: s.projectPlans as any,
        }));
      }
    } catch (e) {
      console.warn("[store] Prisma getUserSessions failed, falling back to memory:", e);
    }
  }

  return Array.from(memorySessions.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}
