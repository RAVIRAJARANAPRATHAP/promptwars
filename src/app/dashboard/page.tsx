"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  Plus, Sparkles, Clock, ChevronRight,
  LayoutDashboard, FileText, Zap, Calendar
} from "lucide-react";

type SavedPlan = { id: string; ideaTitle: string; createdAt: string };
type Session = {
  id: string;
  createdAt: string;
  inputJson: { skills: string[]; interests: string[]; weeks: number; teamSize: number };
  ideasJson: { ideas: { title: string }[] };
  projectPlans: SavedPlan[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = user ? `/api/sessions?userId=${user.uid}` : "/api/sessions";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const totalIdeas = sessions.reduce(
    (sum, s) => sum + (s.ideasJson?.ideas?.length || 0),
    0
  );
  const totalPlans = sessions.reduce((sum, s) => sum + s.projectPlans.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="orb orb-1" style={{ position: "fixed", opacity: 0.05 }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <LayoutDashboard size={20} color="#60a5fa" />
              <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>My Dashboard</h1>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Your saved idea sessions and project roadmaps.</p>
          </div>
          <Link href="/onboard" className="btn-primary">
            <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
              <Plus size={16} />
              New Session
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Idea Sessions", value: sessions.length, icon: Sparkles, color: "#3b82f6" },
            { label: "Ideas Generated", value: totalIdeas, icon: Zap, color: "#8b5cf6" },
            { label: "Roadmaps Saved", value: totalPlans, icon: FileText, color: "#10b981" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass animate-fade-in-up"
                style={{ padding: "20px 24px", borderRadius: 14 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon size={16} color={stat.color} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {stat.label}
                  </span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>
                  {loading ? <div className="skeleton" style={{ height: 36, width: 48, borderRadius: 6 }} /> : stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sessions list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 14 }} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div
            className="glass"
            style={{
              borderRadius: 20,
              padding: "60px 40px",
              textAlign: "center",
              border: "2px dashed var(--border)",
            }}
          >
            <Sparkles size={40} color="#3b82f6" style={{ margin: "0 auto 16px", opacity: 0.6 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No sessions yet</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 15 }}>
              Generate your first set of project ideas to get started.
            </p>
            <Link href="/onboard" className="btn-primary" style={{ display: "inline-flex" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                <Plus size={16} />
                Start Here
              </span>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)", marginBottom: -4 }}>Recent Sessions</h2>
            {sessions.map((session, i) => (
              <div
                key={session.id}
                className="glass glass-hover animate-fade-in-up"
                style={{ borderRadius: 16, padding: "24px", animationDelay: `${i * 0.07}s` }}
              >
                {/* Session header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Sparkles size={14} color="#60a5fa" />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>
                        {session.ideasJson?.ideas?.length || 0} Ideas Generated
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={11} />
                        {timeAgo(session.createdAt)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} />
                        {session.inputJson?.weeks || "?"} weeks
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/ideas/${session.id}`}
                    className="btn-ghost"
                    style={{ fontSize: 13, padding: "6px 12px" }}
                  >
                    View Ideas
                    <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Skills tags */}
                {session.inputJson?.skills?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {session.inputJson.skills.slice(0, 6).map((s) => (
                      <span key={s} className="badge badge-domain" style={{ fontSize: 11 }}>{s}</span>
                    ))}
                    {session.inputJson.skills.length > 6 && (
                      <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "4px 8px" }}>
                        +{session.inputJson.skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                {/* Saved plans */}
                {session.projectPlans.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                      Saved Roadmaps
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {session.projectPlans.map((plan) => (
                        <Link
                          key={plan.id}
                          href={`/plan/${plan.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 14px",
                              borderRadius: 10,
                              background: "rgba(59,130,246,0.07)",
                              border: "1px solid rgba(59,130,246,0.15)",
                              transition: "all 0.15s",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <FileText size={13} color="#60a5fa" />
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                                {plan.ideaTitle}
                              </span>
                            </div>
                            <ChevronRight size={13} color="#60a5fa" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
