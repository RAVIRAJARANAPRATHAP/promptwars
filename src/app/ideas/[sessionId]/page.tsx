"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/Navbar";
import {
  Sparkles, Clock, Users, ChevronRight,
  Zap, Target, Lightbulb, Loader2, ArrowLeft
} from "lucide-react";

type Idea = {
  title: string;
  one_line_pitch: string;
  difficulty: "easy" | "medium" | "hard";
  domain: string;
  why_it_fits_you: string;
  core_problem_solved: string;
  estimated_weeks: number;
};

function DifficultyBadge({ level }: { level: "easy" | "medium" | "hard" }) {
  return (
    <span className={`badge badge-${level}`}>
      {level === "easy" ? "🟢" : level === "medium" ? "🟡" : "🔴"}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function IdeaCardSkeleton() {
  return (
    <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
      <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: "75%", marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 12, width: "40%" }} />
    </div>
  );
}

export default function IdeasPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [input, setInput] = useState<{ skills: string[]; weeks: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the session from the server
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setIdeas(data.session.ideasJson.ideas || []);
        setInput(data.session.inputJson);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSelectIdea = async (idea: Idea, index: number) => {
    if (generating !== null) return;
    setGenerating(index);
    setError("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          ideaIndex: index,
          ideaTitle: idea.title,
          ideaPitch: idea.one_line_pitch,
          skills: input?.skills || [],
          weeks: input?.weeks || 8,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/plan/${data.planId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate plan");
      setGenerating(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="orb orb-1" style={{ position: "fixed", opacity: 0.06 }} />
      <div className="orb orb-2" style={{ position: "fixed", opacity: 0.06 }} />

      <main id="main-content">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <button
              onClick={() => router.push("/onboard")}
              className="btn-ghost"
              aria-label="Start a new idea search"
              style={{ marginBottom: 20, padding: "6px 0" }}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              New search
            </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} color="white" />
            </div>
            <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Your personalised project ideas
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginLeft: 52 }}>
            Click any idea to generate a full development roadmap and build plan.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.25)",
              color: "#fb7185",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Ideas grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <IdeaCardSkeleton key={i} />)
            : ideas.map((idea, i) => (
                <div
                  key={i}
                  className={`idea-card animate-fade-in-up delay-${Math.min(i + 1, 6)}`}
                  onClick={() => handleSelectIdea(idea, i)}
                  style={{ opacity: generating !== null && generating !== i ? 0.5 : 1 }}
                >
                  {/* Generating overlay */}
                  {generating === i && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(8,11,20,0.85)",
                        borderRadius: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        zIndex: 10,
                      }}
                    >
                      <Loader2 size={28} color="#60a5fa" style={{ animation: "spin 1s linear infinite" }} />
                      <span style={{ fontSize: 14, color: "#93c5fd", fontWeight: 600 }}>Generating roadmap...</span>
                    </div>
                  )}

                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <DifficultyBadge level={idea.difficulty} />
                    <span className="badge badge-domain">{idea.domain}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
                    {idea.title}
                  </h3>

                  {/* Pitch */}
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                    {idea.one_line_pitch}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {/* Why it fits */}
                    <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      <Lightbulb size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{idea.why_it_fits_you}</span>
                    </div>

                    {/* Problem solved */}
                    <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      <Target size={14} color="#34d399" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{idea.core_problem_solved}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 14,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)" }}>
                      <Clock size={12} />
                      ~{idea.estimated_weeks} weeks
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#60a5fa",
                      }}
                    >
                      Build this
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Tip */}
        {!loading && (
          <div
            className="glass animate-fade-in"
            style={{
              marginTop: 40,
              padding: "16px 20px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            <Zap size={16} color="#60a5fa" />
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Tip:</strong> Click any card to generate a complete
              week-by-week roadmap, tech stack, and feature breakdown for that idea.
            </span>
          </div>
        )}
      </div>
      </main>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
