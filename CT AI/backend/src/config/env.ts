import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  JWT_SECRET: z
    .string({
      required_error: "JWT_SECRET is required",
    })
    .min(16, "JWT_SECRET should have at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z
    .string({
      required_error: "JWT_REFRESH_SECRET is required",
    })
    .min(16, "JWT_REFRESH_SECRET should have at least 16 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
});

const parsed = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
});

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  console.error("Invalid environment variables", formatted);
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsed.data,
} as const;

