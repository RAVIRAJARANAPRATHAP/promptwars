"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Zap, LayoutDashboard, Plus, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { user, signOutUser, isDemo } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const showAuth = !!user || isDemo;

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-white no-underline" style={{ textDecoration: "none" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
          Project<span style={{ color: "#60a5fa" }}>Spark</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {showAuth ? (
          <>
            <Link href="/dashboard" className="btn-ghost">
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
            <Link href="/onboard" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
                <Plus size={15} />
                New Project
              </span>
            </Link>

            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  title={user.email || "Account"}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <UserIcon size={18} color="#94a3b8" />
                  )}
                </button>

                {showMenu && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 44,
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: "8px",
                      minWidth: 180,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#94a3b8" }}>
                      {user.displayName || user.email}
                    </div>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        signOutUser();
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        fontSize: 13,
                        cursor: "pointer",
                        borderRadius: 6,
                        textAlign: "left",
                        marginTop: 4,
                      }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Link href="/sign-in" className="btn-ghost">Sign In</Link>
            <Link href="/sign-up" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
              <span style={{ position: "relative", zIndex: 1 }}>
                {isLanding ? "Get Started Free" : "Get Started"}
              </span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
