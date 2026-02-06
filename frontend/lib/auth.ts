import { createAuthClient } from "better-auth/react";

// Better Auth client expects the base URL without /api/auth path
// When using Vercel rewrites, use empty string to make requests to same origin
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const BASE_URL = API_URL === "/api" ? "" : API_URL.replace("/api", "");

console.log("Demo Mode:", process.env.NEXT_PUBLIC_DEMO_MODE);
console.log("Auth client BASE_URL:", BASE_URL || "(same-origin via Vercel proxy)");

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

