"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Zap, Loader2, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div className="orb orb-1" style={{ position: "fixed" }} />
      <div className="orb orb-2" style={{ position: "fixed" }} />

      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          padding: "36px 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Zap size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            Sign in to continue to ProjectSpark
          </p>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 10,
              color: "#fca5a5",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="btn-ghost"
          aria-label="Continue with Google authentication"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 12, color: "#64748b" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="signin-email" style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                color: "#f1f5f9",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label htmlFor="signin-password" style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                color: "#f1f5f9",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            aria-label="Sign in"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
              marginTop: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
              {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <>Sign In <ArrowRight size={15} aria-hidden="true" /></>}
            </span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#94a3b8" }}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
            Sign up
          </Link>
        </div>

        {/* Demo Mode Bypass */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            href="/onboard"
            style={{
              fontSize: 12,
              color: "#64748b",
              textDecoration: "underline",
            }}
          >
            Skip & continue in Demo Mode →
          </Link>
        </div>
      </div>
    </main>
  );
}
