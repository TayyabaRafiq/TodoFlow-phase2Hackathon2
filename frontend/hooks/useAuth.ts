"use client";

import { useState, useEffect, useCallback } from "react";
import { DEMO_AUTH_MODE, DEMO_SESSION } from "@/lib/config";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface Session {
  user: User;
}

interface UseAuthReturn {
  session: Session | null;
  isPending: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const signOut = useCallback(async () => {
    if (DEMO_AUTH_MODE) {
      console.log("Demo mode: signOut called (no-op)");
      return;
    }
    // Real auth: dynamically import and call signOut
    const { signOut: betterAuthSignOut } = await import("@/lib/auth");
    await betterAuthSignOut();
  }, []);

  // Demo mode: consistent SSR/client render
  if (DEMO_AUTH_MODE) {
    // Before mount: return neutral loading state (matches server)
    if (!isMounted) {
      return {
        session: null,
        isPending: true,
        isDemo: true,
        signOut,
      };
    }

    // After mount: return demo session
    return {
      session: DEMO_SESSION as Session,
      isPending: false,
      isDemo: true,
      signOut,
    };
  }

  // Real auth mode (Phase 3+): would use Better Auth hooks here
  // For now, return unauthenticated state
  return {
    session: null,
    isPending: false,
    isDemo: false,
    signOut,
  };
}
