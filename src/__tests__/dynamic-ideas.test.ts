import { describe, it, expect } from "vitest";
import {
  normalizeIdeasJson,
  generateDynamicFallbackIdeas,
  normalizePlanJson,
} from "@/lib/normalizers";
import { ValidatedIdeasInput } from "@/lib/validation";

describe("Dynamic Ideas & Normalization Suite", () => {
  const profileA: ValidatedIdeasInput = {
    skills: ["Python", "FastAPI", "TensorFlow"],
    interests: ["Healthcare", "Diagnostics"],
    domains: ["AI / ML"],
    teamSize: 1,
    weeks: 12,
    customSkills: "",
    customInterests: "",
    userId: "test_user_a",
    userEmail: "a@example.com",
    userName: "User A",
  };

  const profileB: ValidatedIdeasInput = {
    skills: ["Flutter", "Firebase", "Dart"],
    interests: ["E-commerce", "Logistics"],
    domains: ["Mobile App"],
    teamSize: 4,
    weeks: 6,
    customSkills: "",
    customInterests: "",
    userId: "test_user_b",
    userEmail: "b@example.com",
    userName: "User B",
  };

  describe("generateDynamicFallbackIdeas", () => {
    it("should generate 6 distinct ideas tailored specifically to Python & Healthcare", () => {
      const result = generateDynamicFallbackIdeas(profileA);
      expect(result.ideas.length).toBe(6);

      const allText = JSON.stringify(result.ideas).toLowerCase();
      expect(allText).toContain("healthcare");
      expect(allText).toContain("python");
      expect(allText).toContain("ai / ml");

      // Verify each idea has required schema fields
      result.ideas.forEach((idea) => {
        expect(idea.title).toBeTruthy();
        expect(idea.one_line_pitch).toBeTruthy();
        expect(["easy", "medium", "hard"]).toContain(idea.difficulty);
        expect(idea.estimated_weeks).toBeGreaterThan(0);
      });
    });

    it("should generate completely different ideas for Flutter & E-commerce", () => {
      const resultA = generateDynamicFallbackIdeas(profileA);
      const resultB = generateDynamicFallbackIdeas(profileB);

      expect(resultA.ideas[0].title).not.toBe(resultB.ideas[0].title);
      expect(resultB.ideas[0].title.toLowerCase()).toContain("e-commerce");

      const allTextB = JSON.stringify(resultB.ideas).toLowerCase();
      expect(allTextB).toContain("flutter");
      expect(allTextB).toContain("mobile app");
    });
  });

  describe("normalizeIdeasJson", () => {
    it("should handle raw array from Gemini", () => {
      const raw = [
        {
          title: "AI Medical Scanner",
          description: "Detects anomalies in chest X-rays using CNNs.",
          difficulty: "Advanced",
          tech_stack: ["Python", "PyTorch"],
          estimated_timeline_weeks: 10,
        },
      ];

      const res = normalizeIdeasJson(raw, profileA);
      expect(res.ideas.length).toBe(1);
      expect(res.ideas[0].title).toBe("AI Medical Scanner");
      expect(res.ideas[0].one_line_pitch).toBe("Detects anomalies in chest X-rays using CNNs.");
      expect(res.ideas[0].difficulty).toBe("hard");
      expect(res.ideas[0].estimated_weeks).toBe(10);
    });

    it("should fallback to dynamic ideas when input is empty or null", () => {
      const res = normalizeIdeasJson(null, profileA);
      expect(res.ideas.length).toBe(6);
      expect(res.ideas[0].why_it_fits_you).toContain("Python");
    });
  });

  describe("normalizePlanJson", () => {
    it("should provide full structured roadmap when given LLM output", () => {
      const raw = {
        problem_statement: "Custom medical vision model.",
        features: {
          core: ["DICOM viewer", "Inference pipeline"],
          stretch: ["Real-time heatmaps"],
        },
        tech_stack: [{ layer: "ML", choice: "PyTorch", why: "State of the art" }],
        roadmap: [{ week: 1, goal: "Data prep", tasks: ["Gather datasets"] }],
        improvements: ["Add adversarial validation"],
        pitfalls: [{ problem: "Data imbalance", solution: "Focal loss" }],
      };

      const plan = normalizePlanJson(raw, { ideaTitle: "Medical Vision", weeks: 10 });
      expect(plan.problem_statement).toBe("Custom medical vision model.");
      expect(plan.features.core.length).toBe(2);
      expect(plan.features.stretch.length).toBe(1);
      expect(plan.tech_stack[0].choice).toBe("PyTorch");
      expect(plan.roadmap[0].goal).toBe("Data prep");
    });

    it("should create resilient default plan if model returns empty response", () => {
      const plan = normalizePlanJson(null, {
        ideaTitle: "Smart IoT Greenhouse",
        skills: ["Arduino", "Python"],
        weeks: 8,
      });

      expect(plan.problem_statement).toContain("Smart IoT Greenhouse");
      expect(plan.features.core.length).toBeGreaterThan(0);
      expect(plan.roadmap.length).toBe(8);
      expect(plan.tech_stack.some((t) => t.choice === "Arduino")).toBe(true);
    });
  });
});
