"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Zap, LayoutDashboard, Plus, LogOut, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { user, signOutUser, isDemo } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const showAuth = !!user || isDemo;
  const hasValidPhoto = !!user?.photoURL && failedPhotoUrl !== user.photoURL;

  // Click outside and Escape key handler for accessible dropdown
  useEffect(() => {
    if (!showMenu) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu]);

  // Calculate clean initial for avatar fallback
  const userDisplayName = user?.displayName?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const initial = (userDisplayName || userEmail || "U").charAt(0).toUpperCase();

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-white no-underline"
        style={{ textDecoration: "none" }}
        aria-label="ProjectSpark Homepage"
      >
        <div
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)",
          }}
        >
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>
        <span className="navbar-logo-text" style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
          Project<span style={{ color: "#60a5fa" }}>Spark</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showAuth ? (
          <>
            <Link
              href="/dashboard"
              className="btn-ghost"
              aria-label="Go to Dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px" }}
            >
              <LayoutDashboard size={16} aria-hidden="true" color="#60a5fa" />
              <span className="navbar-btn-label">Dashboard</span>
            </Link>

            <Link
              href="/onboard"
              className="btn-primary"
              style={{ padding: "7px 14px", fontSize: 13 }}
              aria-label="Start New Project Idea Generation"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5, position: "relative", zIndex: 1 }}>
                <Plus size={15} aria-hidden="true" />
                <span className="navbar-btn-label">New Project</span>
                <span className="inline sm:hidden">New</span>
              </span>
            </Link>

            {user ? (
              <div style={{ position: "relative" }} ref={menuRef}>
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={showMenu}
                  aria-label={userDisplayName ? `${userDisplayName} account options` : "Account options"}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%",
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 0,
                    transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
                    boxShadow: showMenu ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
                  }}
                  title={userEmail || userDisplayName || "Account"}
                >
                  {hasValidPhoto && user?.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.photoURL}
                      alt={userDisplayName ? `${userDisplayName} avatar` : "Profile"}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedPhotoUrl(user.photoURL || "")}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: "0.02em",
                        userSelect: "none",
                      }}
                    >
                      {initial}
                    </div>
                  )}
                </button>

                {showMenu && (
                  <div
                    role="menu"
                    aria-label="User profile options"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 48,
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      padding: "8px",
                      minWidth: 230,
                      boxShadow: "0 16px 36px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                      zIndex: 100,
                      animation: "fadeInUp 0.18s ease-out",
                    }}
                  >
                    {/* User profile card */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {initial}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#f8fafc",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {userDisplayName || "Student"}
                        </div>
                        {userEmail && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginTop: 1,
                            }}
                          >
                            {userEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation links */}
                    <div style={{ padding: "4px 0" }}>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        onClick={() => setShowMenu(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "8px 12px",
                          borderRadius: 8,
                          color: "#e2e8f0",
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LayoutDashboard size={15} aria-hidden="true" color="#60a5fa" />
                        My Dashboard
                      </Link>

                      <Link
                        href="/onboard"
                        role="menuitem"
                        onClick={() => setShowMenu(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "8px 12px",
                          borderRadius: 8,
                          color: "#e2e8f0",
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Sparkles size={15} aria-hidden="true" color="#a78bfa" />
                        Generate Ideas
                      </Link>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 4 }}>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setShowMenu(false);
                          signOutUser();
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "8px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                          borderRadius: 8,
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={15} aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Link href="/sign-in" className="btn-ghost" aria-label="Sign in to your account" style={{ padding: "6px 12px" }}>
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{ padding: "7px 14px", fontSize: 13 }}
              aria-label="Get started free"
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                <span className="navbar-btn-label">{isLanding ? "Get Started Free" : "Get Started"}</span>
                <span className="inline sm:hidden">Get Started</span>
              </span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
