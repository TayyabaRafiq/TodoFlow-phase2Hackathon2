// Feature flags for development and demo purposes
// Set to false when connecting real backend auth

export const DEMO_AUTH_MODE = true;

// Mock session data for demo mode
export const DEMO_SESSION = {
  user: {
    id: "demo-user",
    email: "demo@todo.app",
    name: "Demo User",
    image: null,
  },
};
