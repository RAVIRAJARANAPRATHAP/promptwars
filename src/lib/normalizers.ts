import { ValidatedIdeasInput, ValidatedPlanInput } from "./validation";

export interface NormalizedIdea {
  title: string;
  one_line_pitch: string;
  difficulty: "easy" | "medium" | "hard";
  domain: string;
  why_it_fits_you: string;
  core_problem_solved: string;
  estimated_weeks: number;
}

export interface NormalizedIdeasResult {
  ideas: NormalizedIdea[];
}

export interface NormalizedPlanResult {
  problem_statement: string;
  features: { core: string[]; stretch: string[] };
  tech_stack: { layer: string; choice: string; why: string }[];
  roadmap: { week: number; goal: string; tasks: string[] }[];
  improvements: string[];
  pitfalls: { problem: string; solution: string }[];
}

function normalizeDifficulty(raw: unknown): "easy" | "medium" | "hard" {
  if (typeof raw !== "string") return "medium";
  const lower = raw.toLowerCase();
  if (lower.includes("easy") || lower.includes("beginner")) return "easy";
  if (lower.includes("hard") || lower.includes("advanced") || lower.includes("expert")) return "hard";
  return "medium";
}

/**
 * Normalizes any schema variations from LLM output into the strict Idea structure.
 */
export function normalizeIdeasJson(
  raw: unknown,
  fallbackInput?: Partial<ValidatedIdeasInput>
): NormalizedIdeasResult {
  let list: unknown[] = [];

  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.ideas)) {
      list = obj.ideas;
    } else if (Array.isArray(obj.project_ideas)) {
      list = obj.project_ideas;
    } else if (Array.isArray(obj.projects)) {
      list = obj.projects;
    }
  }

  const primarySkill = fallbackInput?.skills?.[0] || "Software Engineering";
  const primaryDomain = fallbackInput?.domains?.[0] || "Web / AI";
  const defaultWeeks = fallbackInput?.weeks || 8;

  const normalized: NormalizedIdea[] = list.map((item, idx) => {
    if (!item || typeof item !== "object") {
      return {
        title: `Project Concept #${idx + 1}`,
        one_line_pitch: "Innovative capstone project tailored to your technical skills.",
        difficulty: "medium",
        domain: primaryDomain,
        why_it_fits_you: `Leverages your knowledge of ${primarySkill}.`,
        core_problem_solved: "Addresses real-world workflow efficiency and data visualization.",
        estimated_weeks: defaultWeeks,
      };
    }

    const o = item as Record<string, unknown>;
    const title = String(o.title || o.name || `Project Concept #${idx + 1}`).trim();
    const pitch = String(o.one_line_pitch || o.pitch || o.description || o.summary || "").trim();
    const domain = String(o.domain || (Array.isArray(o.tech_stack) ? o.tech_stack.slice(0, 2).join(" / ") : primaryDomain)).trim();
    const whyFits = String(o.why_it_fits_you || o.why_fits || o.fit || `Directly applies your ${primarySkill} skills.`).trim();
    const problem = String(o.core_problem_solved || o.problem || o.solves || "Automates manual workflows and improves efficiency.").trim();
    const weeksRaw = Number(o.estimated_weeks || o.estimated_timeline_weeks || o.weeks || defaultWeeks);
    const estimated_weeks = Number.isInteger(weeksRaw) && weeksRaw > 0 ? weeksRaw : defaultWeeks;

    return {
      title,
      one_line_pitch: pitch || "A tailored software system designed to solve key domain challenges.",
      difficulty: normalizeDifficulty(o.difficulty),
      domain: domain || primaryDomain,
      why_it_fits_you: whyFits,
      core_problem_solved: problem,
      estimated_weeks,
    };
  });

  // If the model produced fewer than 6, or none, supplement with dynamic ideas
  if (normalized.length === 0 && fallbackInput) {
    return generateDynamicFallbackIdeas(fallbackInput as ValidatedIdeasInput);
  }

  return { ideas: normalized.slice(0, 6) };
}

/**
 * Dynamic Algorithmic Generator:
 * Generates 6 highly tailored ideas strictly derived from the user's specific skills,
 * domains, interests, team size, and weeks if offline or if AI model is unreachable.
 */
export function generateDynamicFallbackIdeas(input: ValidatedIdeasInput): NormalizedIdeasResult {
  const skills = input.skills.length > 0 ? input.skills : ["Full-Stack", "JavaScript"];
  const domains = input.domains.length > 0 ? input.domains : ["Web App", "AI / ML"];
  const interests = input.interests.length > 0 ? input.interests : ["Productivity", "Healthcare"];

  const mainSkill = skills[0];
  const secondarySkill = skills[1] || skills[0];
  const mainDomain = domains[0];
  const secondaryDomain = domains[1] || domains[0];
  const mainInterest = interests[0];
  const teamLabel = input.teamSize > 1 ? `${input.teamSize}-person team` : "solo developer";

  const generated: NormalizedIdea[] = [
    {
      title: `${mainInterest}Pulse: Intelligent ${mainDomain} Hub`,
      one_line_pitch: `An automated ${mainDomain} system that analyzes and visualizes real-time ${mainInterest.toLowerCase()} trends with interactive dashboards.`,
      difficulty: "easy",
      domain: `${mainDomain} / ${mainInterest}`,
      why_it_fits_you: `Perfect showcase for your ${mainSkill} skills, ideal for a ${teamLabel} over ${input.weeks} weeks.`,
      core_problem_solved: `Solves fragmented information access in ${mainInterest.toLowerCase()} by unifying actionable data into a single view.`,
      estimated_weeks: Math.max(4, Math.round(input.weeks * 0.7)),
    },
    {
      title: `Smart${secondarySkill.replace(/[^a-zA-Z]/g, "")} Sync`,
      one_line_pitch: `A high-performance pipeline leveraging ${secondarySkill} to automate collaborative workflows and reduce processing latency.`,
      difficulty: "medium",
      domain: `${secondaryDomain} / Tools`,
      why_it_fits_you: `Directly builds on your experience with ${secondarySkill} and passion for ${mainInterest.toLowerCase()}.`,
      core_problem_solved: `Eliminates repetitive manual bottlenecks by providing real-time synchronization and status monitoring.`,
      estimated_weeks: input.weeks,
    },
    {
      title: `${mainDomain.replace(/\s+/g, "")} AI Copilot for ${mainInterest}`,
      one_line_pitch: `An intelligent assistant that analyzes user inputs and provides contextual recommendations for ${mainInterest.toLowerCase()} challenges.`,
      difficulty: "medium",
      domain: `AI / ${mainInterest}`,
      why_it_fits_you: `Combines your ${mainSkill} technical foundation with practical AI integration for high viva impact.`,
      core_problem_solved: `Assists users with decision fatigue by offering personalized, data-backed next-step suggestions.`,
      estimated_weeks: input.weeks,
    },
    {
      title: `SecureFlow: Audited ${secondaryDomain} Platform`,
      one_line_pitch: `A reliable ${secondaryDomain} with cryptographic verification, activity audit logs, and granular access control.`,
      difficulty: "medium",
      domain: `${secondaryDomain} / Security`,
      why_it_fits_you: `Demonstrates full-stack architecture principles using ${skills.join(" and ")}.`,
      core_problem_solved: `Prevents unauthorized data tampering and gives complete visibility over audit trails.`,
      estimated_weeks: Math.max(6, Math.round(input.weeks * 0.85)),
    },
    {
      title: `Omni${mainSkill.replace(/[^a-zA-Z]/g, "")}: Next-Gen Distributed Architecture`,
      one_line_pitch: `An ambitious end-to-end system integrating ${skills.slice(0, 3).join(", ")} with real-time streaming and edge caching.`,
      difficulty: "hard",
      domain: `${mainDomain} / Distributed Systems`,
      why_it_fits_you: `Stretches your expertise across ${mainSkill} and ${secondarySkill} to produce a stand-out capstone demonstration.`,
      core_problem_solved: `Solves high-throughput latency challenges during simultaneous multi-user operations.`,
      estimated_weeks: input.weeks,
    },
    {
      title: `Eco${mainInterest}: Automated Resource Optimization`,
      one_line_pitch: `A smart sensor/metric aggregator that monitors ${mainInterest.toLowerCase()} efficiency and provides proactive alerts.`,
      difficulty: "easy",
      domain: `${mainDomain} / Analytics`,
      why_it_fits_you: `Offers a fast prototype path utilizing ${mainSkill} with clean visual reporting that impresses examiners.`,
      core_problem_solved: `Addresses inefficient resource allocation with automated threshold warnings.`,
      estimated_weeks: Math.max(4, Math.round(input.weeks * 0.6)),
    },
  ];

  return { ideas: generated };
}

/**
 * Normalizes roadmap plan JSON from Gemini.
 */
export function normalizePlanJson(raw: unknown, input?: Partial<ValidatedPlanInput>): NormalizedPlanResult {
  const defaultWeeks = input?.weeks || 8;
  const ideaTitle = input?.ideaTitle || "Capstone Project";

  if (!raw || typeof raw !== "object") {
    return createDefaultPlan(ideaTitle, input?.skills || ["TypeScript"], defaultWeeks);
  }

  const o = raw as Record<string, unknown>;

  const problem_statement = String(o.problem_statement || `${ideaTitle} provides a streamlined, modern software solution addressing critical domain bottlenecks.`).trim();

  const rawFeatures = o.features as { core?: unknown[]; stretch?: unknown[] } | undefined;
  const core = Array.isArray(rawFeatures?.core) ? rawFeatures!.core.map(String) : [
    "Core authentication and user session management",
    "Primary data model and RESTful API pipeline",
    "Interactive responsive dashboard interface",
    "Real-time data visualization and metrics reporting",
  ];
  const stretch = Array.isArray(rawFeatures?.stretch) ? rawFeatures!.stretch.map(String) : [
    "AI-assisted automated insights and recommendation engine",
    "Exportable PDF/CSV reporting and analytics",
    "Offline sync and PWA caching capability",
  ];

  const rawTech = Array.isArray(o.tech_stack) ? o.tech_stack : [];
  const tech_stack = rawTech.length > 0
    ? rawTech.map((item) => {
        const t = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          layer: String(t.layer || "Architecture"),
          choice: String(t.choice || "Modern Framework"),
          why: String(t.why || "Offers high developer velocity and strong ecosystem support."),
        };
      })
    : [
        { layer: "Frontend", choice: "React & Next.js", why: "Provides fast server rendering and component reusability." },
        { layer: "Backend", choice: "Node.js / Python API", why: "Handles concurrent requests and data processing efficiently." },
        { layer: "Database", choice: "PostgreSQL", why: "Ensures relational integrity and robust querying capability." },
      ];

  const rawRoadmap = Array.isArray(o.roadmap) ? o.roadmap : [];
  const roadmap = rawRoadmap.length > 0
    ? rawRoadmap.map((item, idx: number) => {
        const w = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          week: Number(w.week) || idx + 1,
          goal: String(w.goal || `Milestone ${idx + 1}`),
          tasks: Array.isArray(w.tasks) ? w.tasks.map(String) : ["Implement core module", "Run integration tests"],
        };
      })
    : Array.from({ length: Math.min(defaultWeeks, 8) }, (_, i) => ({
        week: i + 1,
        goal: `Week ${i + 1}: Core Milestone`,
        tasks: ["System architecture design", "Module unit tests and documentation"],
      }));

  const improvements = Array.isArray(o.improvements) && o.improvements.length > 0
    ? o.improvements.map(String)
    : [
        "Include live interactive benchmarking to impress examiners",
        "Implement end-to-end automated testing to verify reliability",
        "Prepare a clean architectural diagram for your viva report",
      ];

  const rawPitfalls = Array.isArray(o.pitfalls) ? o.pitfalls : [];
  const pitfalls = rawPitfalls.length > 0
    ? rawPitfalls.map((item) => {
        const p = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          problem: String(p.problem || "Scope creep delaying MVP completion"),
          solution: String(p.solution || "Lock core requirements first before adding stretch features"),
        };
      })
    : [
        { problem: "Over-engineering early before MVP validation", solution: "Focus strictly on the core user journey in weeks 1-3." },
        { problem: "Neglecting viva demo preparation", solution: "Seed sample test data and prepare a 3-minute video walkthrough." },
      ];

  return {
    problem_statement,
    features: { core, stretch },
    tech_stack,
    roadmap,
    improvements,
    pitfalls,
  };
}

function createDefaultPlan(title: string, skills: string[], weeks: number): NormalizedPlanResult {
  return {
    problem_statement: `${title} delivers a high-impact solution engineered to solve user efficiency and automation challenges.`,
    features: {
      core: [
        "User profile and role-based dashboard access",
        "Primary CRUD engine and database persistence",
        "Interactive metrics and state visualizer",
        "Input validation and security sanitization pipeline",
      ],
      stretch: [
        "Predictive AI insights and dynamic suggestions",
        "Exportable audit reports and visual charts",
        "Automated deployment and CI/CD pipelines",
      ],
    },
    tech_stack: skills.map((s) => ({
      layer: "Core Stack",
      choice: s,
      why: "Matches your established expertise, accelerating development velocity.",
    })),
    roadmap: Array.from({ length: Math.min(weeks, 8) }, (_, i) => ({
      week: i + 1,
      goal: `Week ${i + 1}: Implementation Milestone`,
      tasks: ["Configure module dependencies", "Run integration tests"],
    })),
    improvements: [
      "Add interactive benchmark comparisons for demo impact",
      "Prepare clear architectural diagrams for the final submission report",
    ],
    pitfalls: [
      { problem: "Spending too much time on styling early", solution: "Complete core data flow and business logic first." },
    ],
  };
}
