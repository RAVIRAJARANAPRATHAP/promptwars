import { describe, it, expect } from "vitest";
import { sanitizeString } from "@/lib/validation";

describe("User Profile & Auth UX Helpers", () => {
  describe("Avatar Initials & Name Resolution", () => {
    function getInitials(displayName?: string | null, email?: string | null): string {
      const name = (displayName || email || "U").trim();
      return name.charAt(0).toUpperCase();
    }

    function getFirstName(displayName?: string | null, email?: string | null): string {
      const raw = (displayName || email?.split("@")[0] || "Student").trim();
      return raw.split(" ")[0];
    }

    it("should extract correct initial for single or full names", () => {
      expect(getInitials("RAVIRAJARANAPRATHAP")).toBe("R");
      expect(getInitials("Raviraja Ranaprathap")).toBe("R");
      expect(getInitials("john.doe@example.com")).toBe("J");
      expect(getInitials("", "alice@gmail.com")).toBe("A");
      expect(getInitials(null, null)).toBe("U");
    });

    it("should extract first name properly for greeting chips", () => {
      expect(getFirstName("Raviraja Ranaprathap")).toBe("Raviraja");
      expect(getFirstName("RAVIRAJARANAPRATHAP")).toBe("RAVIRAJARANAPRATHAP");
      expect(getFirstName("", "alex.smith@test.com")).toBe("alex.smith");
      expect(getFirstName(null, null)).toBe("Student");
    });
  });

  describe("CTA Route Destination Rules", () => {
    function getHeroPrimaryAction(isAuthenticated: boolean) {
      return isAuthenticated
        ? { href: "/onboard", label: "Generate My Ideas" }
        : { href: "/sign-up", label: "Generate My Ideas" };
    }

    function getHeroSecondaryAction(isAuthenticated: boolean) {
      return isAuthenticated
        ? { href: "/dashboard", label: "Go to Dashboard" }
        : { href: "/sign-in", label: "Sign In" };
    }

    function getBottomCTAAction(isAuthenticated: boolean) {
      return isAuthenticated
        ? { primaryHref: "/onboard", secondaryHref: "/dashboard" }
        : { primaryHref: "/sign-up", secondaryHref: "/sign-in" };
    }

    it("should direct authenticated users to onboard and dashboard instead of sign-in", () => {
      const primary = getHeroPrimaryAction(true);
      const secondary = getHeroSecondaryAction(true);
      const bottom = getBottomCTAAction(true);

      expect(primary.href).toBe("/onboard");
      expect(secondary.href).toBe("/dashboard");
      expect(secondary.label).toBe("Go to Dashboard");
      expect(bottom.primaryHref).toBe("/onboard");
      expect(bottom.secondaryHref).toBe("/dashboard");
    });

    it("should direct unauthenticated users to sign-up and sign-in", () => {
      const primary = getHeroPrimaryAction(false);
      const secondary = getHeroSecondaryAction(false);
      const bottom = getBottomCTAAction(false);

      expect(primary.href).toBe("/sign-up");
      expect(secondary.href).toBe("/sign-in");
      expect(secondary.label).toBe("Sign In");
      expect(bottom.primaryHref).toBe("/sign-up");
      expect(bottom.secondaryHref).toBe("/sign-in");
    });
  });

  describe("Security: Profile & Sync Sanitization", () => {
    it("should sanitize dangerous characters in user input", () => {
      const maliciousName = "<script>alert('pwn')</script>John";
      const sanitized = sanitizeString(maliciousName, 100);
      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
      expect(sanitized).toBe("scriptalert('pwn')/scriptJohn");
    });

    it("should clamp excessively long UIDs and emails", () => {
      const hugeUid = "uid_".repeat(100);
      const sanitized = sanitizeString(hugeUid, 128);
      expect(sanitized.length).toBe(128);
    });
  });
});
