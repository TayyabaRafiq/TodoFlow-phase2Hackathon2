import { createAuthClient } from "better-auth/react";

// Better Auth client configuration
// When using Vercel rewrites (NEXT_PUBLIC_API_URL=/api), use current origin
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const isRelativeURL = API_URL.startsWith("/");

// For relative URLs (proxied via Vercel), use window.location.origin
// For absolute URLs (direct to backend), use the URL without /api
const BASE_URL = isRelativeURL
  ? (typeof window !== "undefined" ? window.location.origin : "")
  : API_URL.replace("/api", "");

console.log("Demo Mode:", process.env.NEXT_PUBLIC_DEMO_MODE);
console.log("Auth client BASE_URL:", BASE_URL);

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

