import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeStringArray,
  validateIdeasInput,
  validatePlanInput,
} from "@/lib/validation";

describe("Validation & Security Sanitization", () => {
  describe("sanitizeString", () => {
    it("should strip HTML tag delimiters", () => {
      const malicious = "<script>alert('xss')</script>Hello";
      expect(sanitizeString(malicious)).toBe("scriptalert('xss')/scriptHello");
    });

    it("should strip non-printable control characters", () => {
      const input = "clean\u0000text\u001Fwith\u007Fchars";
      expect(sanitizeString(input)).toBe("cleantextwithchars");
    });

    it("should truncate strings longer than maxLength", () => {
      const longStr = "a".repeat(300);
      expect(sanitizeString(longStr, 50).length).toBe(50);
    });

    it("should return empty string for non-string inputs", () => {
      expect(sanitizeString(null)).toBe("");
      expect(sanitizeString(undefined)).toBe("");
      expect(sanitizeString(123)).toBe("");
    });
  });

  describe("sanitizeStringArray", () => {
    it("should sanitize and filter empty or invalid entries", () => {
      const input = ["React", "   ", "<Node>", null, 42, "TypeScript"];
      const res = sanitizeStringArray(input);
      expect(res).toEqual(["React", "Node", "TypeScript"]);
    });

    it("should enforce maxItems cap", () => {
      const items = Array.from({ length: 50 }, (_, i) => `Skill${i}`);
      const res = sanitizeStringArray(items, 10);
      expect(res.length).toBe(10);
    });
  });

  describe("validateIdeasInput", () => {
    it("should reject empty or missing skills", () => {
      const res = validateIdeasInput({
        skills: [],
        interests: ["AI"],
        domains: ["web"],
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBeDefined();
    });

    it("should accept valid input and clamp weeks and teamSize within bounds", () => {
      const res = validateIdeasInput({
        skills: ["React", "Node.js"],
        interests: ["Education"],
        domains: ["web"],
        teamSize: 99, // Should clamp to default or max bound
        weeks: -5, // Should clamp to default
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.skills).toEqual(["React", "Node.js"]);
      expect(res.data?.teamSize).toBe(1); // clamped
      expect(res.data?.weeks).toBe(8); // clamped
    });
  });

  describe("validatePlanInput", () => {
    it("should reject missing sessionId", () => {
      const res = validatePlanInput({
        ideaTitle: "AI Chatbot",
        skills: ["Python"],
      });
      expect(res.isValid).toBe(false);
    });

    it("should validate and parse legitimate plan input", () => {
      const res = validatePlanInput({
        sessionId: "sess_12345",
        ideaIndex: 1,
        ideaTitle: "Autonomous Drone",
        ideaPitch: "A drone with computer vision",
        skills: ["Python", "OpenCV"],
        weeks: 10,
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.sessionId).toBe("sess_12345");
      expect(res.data?.ideaIndex).toBe(1);
      expect(res.data?.weeks).toBe(10);
    });
  });
});
