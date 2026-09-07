"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, LayoutDashboard, Sparkles, Plus } from "lucide-react";

export function HeroCTA() {
  const { user, loading, isDemo } = useAuth();
  const isAuthenticated = !!user || isDemo;

  // Render a smooth skeleton while auth state is resolving to prevent CLS
  if (loading) {
    return (
      <div
        className="animate-fade-in-up delay-3"
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          minHeight: 52,
        }}
        aria-busy="true"
        aria-label="Loading authentication status"
      >
        <div
          className="skeleton"
          style={{ width: 200, height: 50, borderRadius: 12 }}
        />
        <div
          className="skeleton"
          style={{ width: 120, height: 50, borderRadius: 12 }}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    const rawName = user?.displayName || user?.email?.split("@")[0] || "Student";
    const firstName = rawName.trim().split(" ")[0];

    return (
      <div className="animate-fade-in-up delay-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Welcome Back chip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 14px",
            borderRadius: 100,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            fontSize: 13,
            color: "#34d399",
            fontWeight: 500,
          }}
        >
          <Sparkles size={13} aria-hidden="true" />
          <span>Welcome back, <strong>{firstName}</strong>! Ready to build?</span>
        </div>

        {/* Authenticated CTA buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/onboard"
            className="btn-primary"
            style={{ fontSize: 16, padding: "14px 32px" }}
            aria-label="Generate new project ideas"
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
              Generate My Ideas
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="btn-secondary"
            style={{ fontSize: 16, padding: "14px 28px" }}
            aria-label="Go to your dashboard"
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LayoutDashboard size={18} aria-hidden="true" color="#60a5fa" />
              Go to Dashboard
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Unauthenticated view
  return (
    <div className="animate-fade-in-up delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <Link
        href="/sign-up"
        className="btn-primary"
        style={{ fontSize: 16, padding: "14px 32px" }}
        aria-label="Get started and generate project ideas"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
          Generate My Ideas
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </Link>

      <Link
        href="/sign-in"
        className="btn-secondary"
        style={{ fontSize: 16, padding: "14px 28px" }}
        aria-label="Sign in to your ProjectSpark account"
      >
        Sign In
      </Link>
    </div>
  );
}

export function BottomCTA() {
  const { user, isDemo } = useAuth();
  const isAuthenticated = !!user || isDemo;

  if (isAuthenticated) {
    return (
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/onboard"
          className="btn-primary"
          style={{ fontSize: 16, padding: "14px 36px" }}
          aria-label="Start new project idea generation"
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
            <Plus size={18} aria-hidden="true" />
            Start New Project
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="btn-secondary"
          style={{ fontSize: 16, padding: "14px 28px" }}
          aria-label="View saved roadmaps on dashboard"
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LayoutDashboard size={18} aria-hidden="true" color="#60a5fa" />
            View Dashboard
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <Link
        href="/sign-up"
        className="btn-primary"
        style={{ fontSize: 16, padding: "14px 36px" }}
        aria-label="Get started free with ProjectSpark"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
          Get Started Free
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </Link>
      <Link
        href="/sign-in"
        className="btn-secondary"
        style={{ fontSize: 16, padding: "14px 28px" }}
        aria-label="Sign in to ProjectSpark"
      >
        Sign In
      </Link>
    </div>
  );
}
