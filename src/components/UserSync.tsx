"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Syncs the Firebase user to our Postgres DB when signed in.
 */
export default function UserSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      }),
    }).catch(console.error);
  }, [user]);

  return null;
}
