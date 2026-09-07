"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, CheckCircle2, Circle, Zap, Layers,
  Clock, AlertTriangle, TrendingUp, Code2, Star
} from "lucide-react";

type TechItem = { layer: string; choice: string; why: string };
type RoadmapWeek = { week: number; goal: string; tasks: string[] };
type Pitfall = { problem: string; solution: string };
type Plan = {
  problem_statement: string;
  features: { core: string[]; stretch: string[] };
  tech_stack: TechItem[];
  roadmap: RoadmapWeek[];
  improvements: string[];
  pitfalls: Pitfall[];
};

function SectionTitle({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />
      ))}
    </div>
  );
}

export default function PlanPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/plans/${planId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPlan(data.plan.planJson as Plan);
        setIdeaTitle(data.plan.ideaTitle);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [planId]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="orb orb-1" style={{ position: "fixed", opacity: 0.05 }} />

      <main id="main-content">
        <div className="responsive-page-container" style={{ maxWidth: 900 }}>
          <button
            onClick={() => router.back()}
            className="btn-ghost"
            aria-label="Back to generated ideas"
            style={{ marginBottom: 24, padding: "6px 0" }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to ideas
          </button>

        {loading && <Skeleton />}
        {error && (
          <div style={{ padding: "16px", borderRadius: 12, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", color: "#fb7185" }}>
            {error}
          </div>
        )}

        {plan && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Header */}
            <div className="animate-fade-in-up">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Project Roadmap</p>
                  <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.02em" }}>{ideaTitle}</h1>
                </div>
              </div>
              <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>{plan.problem_statement}</p>
              </div>
            </div>

            {/* Features */}
            <div className="animate-fade-in-up delay-1">
              <SectionTitle icon={<CheckCircle2 size={18} color="#10b981" />} title="Features" color="#10b981" />
              <div className="features-grid">
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                    ✅ Core (MVP)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.core.map((f, i) => (
                      <div key={i} className="feature-pill">
                        <CheckCircle2 size={14} color="#34d399" className="icon" />
                        <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                    🌟 Stretch Goals
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.stretch.map((f, i) => (
                      <div key={i} className="feature-pill">
                        <Circle size={14} color="#fbbf24" className="icon" />
                        <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="animate-fade-in-up delay-2">
              <SectionTitle icon={<Code2 size={18} color="#3b82f6" />} title="Tech Stack" color="#3b82f6" />
              <div className="glass table-scroll-container">
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Technology</th>
                      <th>Why this choice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.tech_stack.map((t, i) => (
                      <tr key={i}>
                        <td style={{ color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>{t.layer}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-flex",
                              padding: "3px 10px",
                              borderRadius: 6,
                              background: "rgba(59,130,246,0.1)",
                              color: "#60a5fa",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {t.choice}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{t.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Roadmap */}
            <div className="animate-fade-in-up delay-3">
              <SectionTitle icon={<Clock size={18} color="#8b5cf6" />} title="Week-by-Week Roadmap" color="#8b5cf6" />
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {plan.roadmap.map((week, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot">W{week.week}</div>
                    <div className="glass" style={{ flex: 1, padding: 20, borderRadius: 14, marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--text-primary)" }}>
                        {week.goal}
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                        {week.tasks.map((task, j) => (
                          <li key={j} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--accent-blue)", marginTop: 1, flexShrink: 0 }}>→</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="animate-fade-in-up delay-4">
              <SectionTitle icon={<TrendingUp size={18} color="#f59e0b" />} title="How to Stand Out" color="#f59e0b" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.improvements.map((tip, i) => (
                  <div key={i} className="glass" style={{ padding: 18, borderRadius: 12, display: "flex", gap: 12 }}>
                    <Star size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitfalls */}
            <div className="animate-fade-in-up delay-5">
              <SectionTitle icon={<AlertTriangle size={18} color="#f43f5e" />} title="Common Pitfalls to Avoid" color="#f43f5e" />
              <div className="pitfalls-grid">
                {plan.pitfalls.map((p, i) => (
                  <div key={i} className="glass" style={{ padding: 20, borderRadius: 12 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <AlertTriangle size={14} color="#fb7185" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#fb7185" }}>{p.problem}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <CheckCircle2 size={14} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div
              className="glass animate-fade-in-up delay-6"
              style={{
                padding: "28px 24px",
                borderRadius: 16,
                textAlign: "center",
                background: "linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <Layers size={28} color="#60a5fa" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to start building?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                Your roadmap is ready. Save this plan and start Week 1.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary"
                style={{ margin: "0 auto" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                  View Dashboard
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
