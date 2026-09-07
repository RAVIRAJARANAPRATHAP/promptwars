"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight, ChevronLeft, Sparkles, Code2,
  Clock, Users, Globe, Loader2
} from "lucide-react";

// ── Data definitions ──────────────────────────────────────────────────
const SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C/C++", "Kotlin", "Swift",
  "React", "Next.js", "Vue", "Angular", "Node.js", "Express", "FastAPI", "Django",
  "React Native", "Flutter", "Android", "iOS",
  "SQL", "PostgreSQL", "MongoDB", "MySQL", "Firebase",
  "TensorFlow", "PyTorch", "scikit-learn", "OpenCV",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure",
  "REST APIs", "GraphQL", "WebSockets", "Git",
];

const INTERESTS = [
  "Healthcare", "Education", "Environment", "Finance", "E-commerce",
  "Social Media", "Gaming", "Productivity", "Security", "Blockchain",
  "Smart Cities", "Agriculture", "Entertainment", "Transportation",
  "Mental Health", "Sports & Fitness",
];

const DOMAINS = [
  { id: "web", label: "Web App", emoji: "🌐" },
  { id: "mobile", label: "Mobile App", emoji: "📱" },
  { id: "ai_ml", label: "AI / ML", emoji: "🤖" },
  { id: "iot", label: "IoT / Hardware", emoji: "🔌" },
  { id: "blockchain", label: "Blockchain", emoji: "⛓️" },
  { id: "devtools", label: "Developer Tools", emoji: "🛠️" },
  { id: "data", label: "Data / Analytics", emoji: "📊" },
  { id: "game", label: "Game Dev", emoji: "🎮" },
];

type FormData = {
  skills: string[];
  interests: string[];
  domains: string[];
  teamSize: number;
  weeks: number;
  customSkills: string;
  customInterests: string;
};

const STEPS = ["Skills", "Interests", "Preferences"];

// ── Chip helper component ─────────────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`tag-chip ${selected ? "selected" : ""}`}
    >
      {label}
    </button>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      style={{ marginBottom: 32 }}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current + 1} of ${total}: ${STEPS[current]}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        {STEPS.map((s, i) => (
          <span
            key={s}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: i <= current ? "var(--accent-blue)" : "var(--text-muted)",
              transition: "color 0.3s",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function OnboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    skills: [],
    interests: [],
    domains: [],
    teamSize: 1,
    weeks: 8,
    customSkills: "",
    customInterests: "",
  });

  const toggle = (field: "skills" | "interests" | "domains", value: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((x) => x !== value)
        : [...f[field], value],
    }));
  };

  const canProceed = () => {
    if (step === 0) return form.skills.length > 0 || form.customSkills.trim().length > 0;
    if (step === 1) return form.interests.length > 0 || form.customInterests.trim().length > 0;
    return form.domains.length > 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        userId: user?.uid || "demo_student",
        userEmail: user?.email || "demo_student@projectspark.dev",
        userName: user?.displayName || "Demo Student",
      };
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/ideas/${data.sessionId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="orb orb-1" style={{ position: "fixed", opacity: 0.06 }} />
      <div className="orb orb-2" style={{ position: "fixed", opacity: 0.06 }} />

      <main id="main-content">
        <div
          className="responsive-page-container"
          style={{ maxWidth: 700 }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 100,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                fontSize: 12,
                fontWeight: 600,
                color: "#93c5fd",
                marginBottom: 16,
              }}
            >
              <Sparkles size={12} aria-hidden="true" />
              Step {step + 1} of {STEPS.length}
            </div>
            <h1
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              {step === 0 && "What are your skills?"}
              {step === 1 && "What are you interested in?"}
              {step === 2 && "Project preferences"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              {step === 0 && "Select all the technologies and tools you're comfortable with."}
              {step === 1 && "Pick the domains and problems that excite you most."}
              {step === 2 && "Tell us about your project constraints."}
            </p>
          </div>

          {/* Card */}
          <div
            className="glass responsive-card animate-scale-in"
            style={{ marginBottom: 24 }}
          >
            <StepProgress current={step} total={STEPS.length} />

            {/* Step 0: Skills */}
            {step === 0 && (
              <div>
                <span className="form-label" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Code2 size={14} aria-hidden="true" />
                  Technologies & Tools
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }} role="group" aria-label="Select skills">
                  {SKILLS.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      selected={form.skills.includes(s)}
                      onClick={() => toggle("skills", s)}
                    />
                  ))}
                </div>
                <label htmlFor="custom-skills" className="form-label" style={{ marginTop: 4 }}>
                  Other skills (comma separated)
                </label>
                <input
                  id="custom-skills"
                  className="form-input"
                  placeholder="e.g. Rust, MATLAB, Arduino..."
                  value={form.customSkills}
                  onChange={(e) => setForm((f) => ({ ...f, customSkills: e.target.value }))}
                />
              </div>
            )}

            {/* Step 1: Interests */}
            {step === 1 && (
              <div>
                <span className="form-label" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Globe size={14} aria-hidden="true" />
                  Problem Domains
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }} role="group" aria-label="Select interests">
                  {INTERESTS.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      selected={form.interests.includes(s)}
                      onClick={() => toggle("interests", s)}
                    />
                  ))}
                </div>
                <label htmlFor="custom-interests" className="form-label" style={{ marginTop: 4 }}>
                  Other interests
                </label>
                <input
                  id="custom-interests"
                  className="form-input"
                  placeholder="e.g. Space Tech, Fashion, Accessibility..."
                  value={form.customInterests}
                  onChange={(e) => setForm((f) => ({ ...f, customInterests: e.target.value }))}
                />
              </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* Preferred domain */}
                <div>
                  <span className="form-label" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Globe size={14} aria-hidden="true" />
                    Preferred Project Type (pick up to 3)
                  </span>
                  <div className="domain-grid" role="group" aria-label="Preferred Project Types">
                    {DOMAINS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggle("domains", d.id)}
                        aria-pressed={form.domains.includes(d.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: 10,
                          border: `1px solid ${form.domains.includes(d.id) ? "var(--accent-blue)" : "var(--border)"}`,
                          background: form.domains.includes(d.id) ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                          color: form.domains.includes(d.id) ? "#93c5fd" : "var(--text-secondary)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: 500,
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        <span aria-hidden="true">{d.emoji}</span>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time available */}
                <div>
                  <label htmlFor="weeks-slider" className="form-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Clock size={14} aria-hidden="true" />
                    Available Time: <span style={{ color: "var(--accent-blue)", marginLeft: 4 }}>{form.weeks} weeks</span>
                  </label>
                  <input
                    id="weeks-slider"
                    type="range"
                    min={4}
                    max={20}
                    step={1}
                    value={form.weeks}
                    aria-label="Available project duration in weeks"
                    aria-valuemin={4}
                    aria-valuemax={20}
                    aria-valuenow={form.weeks}
                    onChange={(e) => setForm((f) => ({ ...f, weeks: +e.target.value }))}
                    style={{ width: "100%", marginTop: 10, accentColor: "var(--accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    <span>4 weeks</span>
                    <span>20 weeks</span>
                  </div>
                </div>

                {/* Team size */}
                <div>
                  <span className="form-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Users size={14} aria-hidden="true" />
                    Team Size: <span style={{ color: "var(--accent-blue)", marginLeft: 4 }}>{form.teamSize === 1 ? "Solo" : `${form.teamSize} people`}</span>
                  </span>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }} role="group" aria-label="Select Team Size">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, teamSize: n }))}
                        aria-pressed={form.teamSize === n}
                        aria-label={`Team size ${n} ${n === 1 ? "person (solo)" : "people"}`}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: `1px solid ${form.teamSize === n ? "var(--accent-blue)" : "var(--border)"}`,
                          background: form.teamSize === n ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.02)",
                          color: form.teamSize === n ? "#93c5fd" : "var(--text-secondary)",
                          cursor: "pointer",
                          fontSize: 15,
                          fontWeight: 700,
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.25)",
                color: "#fb7185",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
            {step > 0 ? (
              <button
                className="btn-secondary"
                onClick={() => setStep((s) => s - 1)}
                aria-label="Go back to previous step"
                style={{ flex: 1 }}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                aria-label="Continue to next step"
                style={{ flex: 1, opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? "pointer" : "not-allowed" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                  Continue
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                aria-label="Generate tailored project ideas"
                style={{ flex: 1, opacity: canProceed() && !loading ? 1 : 0.5, cursor: canProceed() && !loading ? "pointer" : "not-allowed" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }} aria-live="polite">
                  {loading ? (
                    <>
                      <Loader2 size={16} aria-hidden="true" style={{ animation: "spin 1s linear infinite" }} />
                      Generating ideas...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} aria-hidden="true" />
                      Generate My Ideas
                    </>
                  )}
                </span>
              </button>
            )}
          </div>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </main>
    </div>
  );
}
