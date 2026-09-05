import { describe, it, expect } from "vitest";
import { IDEA_GENERATOR_SYSTEM_PROMPT, ROADMAP_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";

describe("System Prompts Schema Specifications", () => {
  it("should define JSON schema for idea generation", () => {
    expect(IDEA_GENERATOR_SYSTEM_PROMPT).toContain("Output strict JSON");
    expect(IDEA_GENERATOR_SYSTEM_PROMPT).toContain("ideas");
    expect(IDEA_GENERATOR_SYSTEM_PROMPT).toContain("difficulty");
    expect(IDEA_GENERATOR_SYSTEM_PROMPT).toContain("estimated_weeks");
  });

  it("should define JSON schema for roadmap generation", () => {
    expect(ROADMAP_GENERATOR_SYSTEM_PROMPT).toContain("problem_statement");
    expect(ROADMAP_GENERATOR_SYSTEM_PROMPT).toContain("features");
    expect(ROADMAP_GENERATOR_SYSTEM_PROMPT).toContain("tech_stack");
    expect(ROADMAP_GENERATOR_SYSTEM_PROMPT).toContain("roadmap");
    expect(ROADMAP_GENERATOR_SYSTEM_PROMPT).toContain("pitfalls");
  });
});
