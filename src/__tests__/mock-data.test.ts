import { describe, it, expect } from "vitest";
import { MOCK_IDEAS, MOCK_PLAN } from "@/lib/mock-data";

describe("Mock Data Integrity", () => {
  it("should provide 6 complete mock ideas with correct schemas", () => {
    expect(MOCK_IDEAS.ideas).toBeDefined();
    expect(MOCK_IDEAS.ideas.length).toBe(6);

    for (const idea of MOCK_IDEAS.ideas) {
      expect(idea.title).toBeTypeOf("string");
      expect(idea.one_line_pitch).toBeTypeOf("string");
      expect(["easy", "medium", "hard"]).toContain(idea.difficulty);
      expect(idea.domain).toBeTypeOf("string");
      expect(idea.why_it_fits_you).toBeTypeOf("string");
      expect(idea.core_problem_solved).toBeTypeOf("string");
      expect(idea.estimated_weeks).toBeGreaterThan(0);
    }
  });

  it("should provide structured roadmap, features, tech stack, and pitfalls in MOCK_PLAN", () => {
    expect(MOCK_PLAN.problem_statement).toBeTypeOf("string");
    expect(Array.isArray(MOCK_PLAN.features.core)).toBe(true);
    expect(Array.isArray(MOCK_PLAN.features.stretch)).toBe(true);
    expect(Array.isArray(MOCK_PLAN.tech_stack)).toBe(true);
    expect(Array.isArray(MOCK_PLAN.roadmap)).toBe(true);
    expect(Array.isArray(MOCK_PLAN.pitfalls)).toBe(true);

    expect(MOCK_PLAN.roadmap.length).toBeGreaterThanOrEqual(4);
    for (const week of MOCK_PLAN.roadmap) {
      expect(week.week).toBeTypeOf("number");
      expect(week.goal).toBeTypeOf("string");
      expect(Array.isArray(week.tasks)).toBe(true);
    }
  });
});
