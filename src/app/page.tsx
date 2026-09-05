import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Zap, Sparkles, Map, BookOpen, ArrowRight,
  Brain, GitBranch, Layers, Users, Clock, Star
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Idea Generation",
    description: "Describe your skills and interests. Gemini AI crafts 6 personalized project ideas ranked by feasibility and wow-factor.",
    color: "#3b82f6",
  },
  {
    icon: Map,
    title: "Full Development Roadmap",
    description: "Pick an idea and get a week-by-week build plan, tech stack recommendations, and feature breakdowns.",
    color: "#8b5cf6",
  },
  {
    icon: GitBranch,
    title: "Tech Stack Guidance",
    description: "Get tool recommendations tailored to your known skills — with justifications for every choice.",
    color: "#06b6d4",
  },
  {
    icon: Layers,
    title: "Core + Stretch Features",
    description: "Know exactly what to build for MVP and what optional features will impress your examiners.",
    color: "#10b981",
  },
  {
    icon: Star,
    title: "Differentiation Tips",
    description: "Learn 3–4 specific ways to make your project stand out from typical submissions.",
    color: "#f59e0b",
  },
  {
    icon: BookOpen,
    title: "Pitfall Prevention",
    description: "Know what trips other students up on this type of project — and how to sidestep every trap.",
    color: "#f43f5e",
  },
];

const steps = [
  { number: "01", title: "Fill Your Profile", desc: "Tell us your skills, interests, domain preference, available weeks, and team size." },
  { number: "02", title: "Get 6 Tailored Ideas", desc: "AI generates ranked ideas that match your exact skill level and goals." },
  { number: "03", title: "Pick One & Deep Dive", desc: "Get a complete build roadmap, tech stack, features, and improvement tips." },
];

const stats = [
  { value: "6+", label: "Ideas per session" },
  { value: "8", label: "Weeks of roadmap" },
  { value: "100%", label: "Tailored to you" },
  { value: "Free", label: "To get started" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="hero-bg"
        style={{ paddingTop: 160, paddingBottom: 100, textAlign: "center", position: "relative" }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.25)",
              marginBottom: 28,
              fontSize: 13,
              fontWeight: 600,
              color: "#93c5fd",
            }}
          >
            <Sparkles size={13} />
            Powered by Gemini AI
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-1"
            style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}
          >
            Turn your skills into{" "}
            <span className="gradient-text">a project that matters</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in-up delay-2"
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text-secondary)", marginBottom: 44, maxWidth: 600, margin: "0 auto 44px" }}
          >
            Final-year project stress? ProjectSpark generates 6 tailored ideas
            based on what you know, then builds a complete week-by-week roadmap
            so you can start building — not wondering.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                Generate My Ideas
                <ArrowRight size={18} />
              </span>
            </Link>
            <Link href="/sign-in" className="btn-secondary">
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-in-up delay-4"
            style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginTop: 64 }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "80px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            How it works
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            From blank page to build plan in minutes
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="glass animate-fade-in-up"
              style={{ padding: 28, borderRadius: 16, animationDelay: `${i * 0.1}s` }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 16,
                  lineHeight: 1,
                }}
              >
                {step.number}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Features
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Everything you need to ship a great final year project
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass glass-hover animate-fade-in-up"
                style={{ padding: 24, borderRadius: 14, animationDelay: `${i * 0.08}s` }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={20} color={feat.color} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "80px 24px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div
          className="glass"
          style={{
            borderRadius: 24,
            padding: "52px 40px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <Zap size={36} color="#60a5fa" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Ready to spark your project?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: 16 }}>
            Join hundreds of students who stopped second-guessing and started building.
          </p>
          <Link href="/sign-up" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
              Get Started Free
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
          <Zap size={14} color="#60a5fa" />
          <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>ProjectSpark</span>
        </div>
        <p>Built for final-year students. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
}
