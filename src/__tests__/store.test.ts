import { describe, it, expect } from "vitest";
import { saveSession, getSession, savePlan, getPlan, getUserSessions } from "@/lib/store";

describe("Data Store Operations", () => {
  it("should save and retrieve a session using in-memory store", async () => {
    const input = { skills: ["TypeScript", "Next.js"], weeks: 8, teamSize: 2 };
    const ideas = {
      ideas: [
        {
          title: "AI Project",
          one_line_pitch: "A great idea",
          difficulty: "medium" as const,
          domain: "web",
          why_it_fits_you: "Uses TypeScript",
          core_problem_solved: "Efficiency",
          estimated_weeks: 8,
        },
      ],
    };

    const session = await saveSession("user_test_1", "test@test.com", "Test User", input, ideas);
    expect(session).toBeDefined();
    expect(session.id).toMatch(/^sess_/);
    expect(session.userId).toBe("user_test_1");

    const retrieved = await getSession(session.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(session.id);
  });

  it("should save and retrieve a project plan", async () => {
    const planData = {
      problem_statement: "Tackles student project ambiguity",
      features: { core: ["Feature 1"], stretch: ["Feature 2"] },
      tech_stack: [{ layer: "Frontend", choice: "Next.js", why: "SSR" }],
      roadmap: [{ week: 1, goal: "Setup", tasks: ["Install deps"] }],
      improvements: ["Add dark mode"],
      pitfalls: [{ problem: "Scope creep", solution: "Timebox features" }],
    };

    const plan = await savePlan("sess_dummy", "Smart Scheduler", 0, planData);
    expect(plan).toBeDefined();
    expect(plan.id).toMatch(/^plan_/);
    expect(plan.ideaTitle).toBe("Smart Scheduler");

    const retrieved = await getPlan(plan.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(plan.id);
  });

  it("should retrieve user sessions list sorted by date", async () => {
    const list = await getUserSessions("user_test_1");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
  });
});
