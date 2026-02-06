import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma.js";

export const auth = betterAuth({
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
  // Cross-domain cookie configuration for production (Vercel ↔ HF)
  advanced: {
    cookieOptions: {
      secure: true,      // HTTPS only (required for SameSite=none)
      sameSite: "none",  // CRITICAL: Allows cross-domain cookies
      httpOnly: true,    // Security: prevents XSS access
      path: "/",         // Available to all routes
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});

export type Session = typeof auth.$Infer.Session;
