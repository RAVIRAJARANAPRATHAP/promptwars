import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Check if DATABASE_URL is available
    const dbUrl = process.env.DATABASE_URL;
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    });
  }
  return globalForPrisma.prisma;
}

// Lazy proxy so importing `prisma` NEVER throws at build time or module load
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
