import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma.js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  trustedOrigins: [
    process.env.CORS_ORIGIN || "http://localhost:3000",
    "http://localhost:3001", // fallback port
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // Cross-domain cookie configuration for production (Vercel ↔ HF)
  // This applies to ALL cookies (session_token AND session_data)
  advanced: {
    cookieOptions: {
      sameSite: "none",  // CRITICAL: Allows cross-domain cookies
      secure: true,      // HTTPS only (required for SameSite=none)
      httpOnly: true,    // Security: prevents XSS access
      path: "/",         // Available to all routes
    },
  },
});

export type Session = typeof auth.$Infer.Session;
