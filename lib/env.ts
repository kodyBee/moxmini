// Environment variable validation
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "POSTGRES_URL",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}\n\n` +
        `Please add these to your .env.local file for development or ` +
        `to your Vercel project settings for production.`
    );
  }
}

// Validate on server startup (only in production or when explicitly requested)
if (process.env.NODE_ENV === "production") {
  try {
    validateEnv();
    console.log("✓ All required environment variables are set");
  } catch (error) {
    console.error("❌ Environment validation failed:", error);
    // Don't throw in production, just log - allows graceful degradation
  }
}
