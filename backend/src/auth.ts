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
  cookies: {
  sessionToken: {
    name: "better-auth.session-token",
    options: {
      httpOnly: true,
      secure: true,      // HTTPS required (Vercel + HF)
      sameSite: "none",  // Cross-domain ke liye MUST
      path: "/",
    },
  },
},

  // Better Auth automatically configures cookies correctly for cross-domain
  // when baseURL (HTTPS) and trustedOrigins are set properly
});

export type Session = typeof auth.$Infer.Session;
