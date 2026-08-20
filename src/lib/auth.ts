import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

// Resolve the app's public URL across environments (local, Vercel, custom).
const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;
const appBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  vercelUrl ||
  "http://localhost:3000";

export const auth = betterAuth({
  baseURL: appBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    appBaseURL,
    "http://localhost:3000",
    "http://localhost:3002",
    ...(vercelUrl ? [vercelUrl] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL]
      : []),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      // Chosen by the user at signup (CLIENT or DESIGNER only — ADMIN is
      // assigned server-side). Sanitized in the create hook below.
      role: {
        type: "string",
        defaultValue: "CLIENT",
        input: true,
      },
      telegramId: { type: "string", required: false, input: false },
      telegramUsername: { type: "string", required: false, input: false },
      telegramPhotoUrl: { type: "string", required: false, input: false },
      telegramVerified: { type: "boolean", defaultValue: false, input: false },
      verificationStatus: {
        type: "string",
        defaultValue: "PENDING",
        input: false,
      },
      rejectionReason: { type: "string", required: false, input: false },
      headline: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
      location: { type: "string", required: false, input: false },
      phone: { type: "string", required: false, input: false },
      onboarded: { type: "boolean", defaultValue: false, input: false },
      profileImage: { type: "string", required: false, input: false },
      timezone: { type: "string", required: false, input: false },
      languages: { type: "string", required: false, input: false },
      yearsExperience: { type: "number", required: false, input: false },
      availability: { type: "string", required: false, input: false },
      linkedinUrl: { type: "string", required: false, input: false },
      skills: { type: "string", required: false, input: false },
      portfolioUrl: { type: "string", required: false, input: false },
      hourlyRate: { type: "number", required: false, input: false },
      company: { type: "string", required: false, input: false },
      companyWebsite: { type: "string", required: false, input: false },
      industry: { type: "string", required: false, input: false },
    },
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {},
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = (user as { role?: string }).role;
          let role = requested === "DESIGNER" ? "DESIGNER" : "CLIENT";

          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
          if (adminEmail && user.email.toLowerCase() === adminEmail) {
            role = "ADMIN";
          }

          return {
            data: {
              ...user,
              role,
              // Admins are trusted immediately; everyone else awaits review.
              verificationStatus: role === "ADMIN" ? "APPROVED" : "PENDING",
            },
          };
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
