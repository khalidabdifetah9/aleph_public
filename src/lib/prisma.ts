import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Neon's serverless driver uses WebSockets, which need a constructor in Node.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  // The Neon pooler hostname can occasionally fail DNS resolution on some
  // local networks. In development, prefer DIRECT_URL for stability.
  const connectionString =
    process.env.NODE_ENV === "development"
      ? process.env.DIRECT_URL || process.env.DATABASE_URL
      : process.env.DATABASE_URL || process.env.DIRECT_URL;

  const adapter = new PrismaNeon({
    connectionString,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
