import dotenv from "dotenv";
import express from "express";

// Load .env.local first (takes precedence), then .env
dotenv.config({ path: ".env.local" });
dotenv.config();
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { errorHandler } from "./middleware/error.js";
import { authRateLimiter, apiRateLimiter } from "./middleware/rateLimit.js";
import taskRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - allow both port 3000 and 3001 for development
const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:3000",
  "http://localhost:3001",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Better Auth handler - must be before JSON body parser for /api/auth routes
// Apply stricter rate limiting to auth endpoints
app.use("/api/auth", authRateLimiter, async (req, res, next) => {
  console.log(`📨 Auth Request: ${req.method} ${req.originalUrl} (path: ${req.path})`);

  try {
    await toNodeHandler(auth)(req, res);
  } catch (error) {
    console.error("❌ Better Auth Error:", {
      path: req.path,
      method: req.method,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Let the error handler middleware handle the response
    next(error);
  }
});

// JSON body parser
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "TodoFlow API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth/*",
      tasks: "/api/tasks"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Task routes with rate limiting
app.use("/api/tasks", apiRateLimiter, taskRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server - bind to 0.0.0.0 for Docker containers
const HOST = "0.0.0.0";
app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
