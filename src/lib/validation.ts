/**
 * Security & Input Validation utilities.
 * Guards against prompt injection, malicious payload overflow, and invalid request schemas.
 */

export interface ValidatedIdeasInput {
  skills: string[];
  interests: string[];
  domains: string[];
  teamSize: number;
  weeks: number;
  customSkills: string;
  customInterests: string;
  userId: string;
  userEmail: string;
  userName: string;
}

export interface ValidatedPlanInput {
  sessionId: string;
  ideaIndex: number;
  ideaTitle: string;
  ideaPitch: string;
  skills: string[];
  weeks: number;
}

/**
 * Sanitizes input string to prevent control character exploitation,
 * excessive whitespace, and basic script injection.
 */
export function sanitizeString(input: unknown, maxLength = 250): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip non-printable control chars
    .replace(/[<>]/g, "") // Strip HTML tag delimiters
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes an array of string tags (e.g. skills or interests).
 */
export function sanitizeStringArray(arr: unknown, maxItems = 30, maxItemLen = 50): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => sanitizeString(item, maxItemLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

/**
 * Validates request payload for /api/generate-ideas.
 */
export function validateIdeasInput(body: unknown): {
  isValid: boolean;
  data?: ValidatedIdeasInput;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request body: expected a JSON object" };
  }

  const b = body as Record<string, unknown>;

  const skills = sanitizeStringArray(b.skills);
  const interests = sanitizeStringArray(b.interests);
  const domains = sanitizeStringArray(b.domains, 10, 30);
  const customSkills = sanitizeString(b.customSkills, 300);
  const customInterests = sanitizeString(b.customInterests, 300);

  // Parse and clamp teamSize (1 - 10)
  const rawTeamSize = Number(b.teamSize);
  const teamSize = Number.isInteger(rawTeamSize) && rawTeamSize >= 1 && rawTeamSize <= 10
    ? rawTeamSize
    : 1;

  // Parse and clamp weeks (1 - 52)
  const rawWeeks = Number(b.weeks);
  const weeks = Number.isInteger(rawWeeks) && rawWeeks >= 1 && rawWeeks <= 52
    ? rawWeeks
    : 8;

  const userId = sanitizeString(b.userId || "demo_student", 128);
  const userEmail = sanitizeString(b.userEmail || "demo_student@projectspark.dev", 128);
  const userName = sanitizeString(b.userName || "Demo Student", 100);

  if (skills.length === 0 && !customSkills) {
    return { isValid: false, error: "Please provide at least one skill or custom skill." };
  }

  return {
    isValid: true,
    data: {
      skills,
      interests,
      domains,
      teamSize,
      weeks,
      customSkills,
      customInterests,
      userId,
      userEmail,
      userName,
    },
  };
}

/**
 * Validates request payload for /api/generate-plan.
 */
export function validatePlanInput(body: unknown): {
  isValid: boolean;
  data?: ValidatedPlanInput;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request body: expected a JSON object" };
  }

  const b = body as Record<string, unknown>;

  const sessionId = sanitizeString(b.sessionId, 64);
  if (!sessionId) {
    return { isValid: false, error: "Missing or invalid sessionId." };
  }

  const rawIdeaIndex = Number(b.ideaIndex);
  const ideaIndex = Number.isInteger(rawIdeaIndex) && rawIdeaIndex >= 0 && rawIdeaIndex < 20
    ? rawIdeaIndex
    : 0;

  const ideaTitle = sanitizeString(b.ideaTitle, 150);
  if (!ideaTitle) {
    return { isValid: false, error: "Missing idea title." };
  }

  const ideaPitch = sanitizeString(b.ideaPitch, 500);

  const skills = sanitizeStringArray(b.skills);

  const rawWeeks = Number(b.weeks);
  const weeks = Number.isInteger(rawWeeks) && rawWeeks >= 1 && rawWeeks <= 52
    ? rawWeeks
    : 8;

  return {
    isValid: true,
    data: {
      sessionId,
      ideaIndex,
      ideaTitle,
      ideaPitch,
      skills,
      weeks,
    },
  };
}
