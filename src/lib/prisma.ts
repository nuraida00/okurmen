/**
 * Prisma client singleton with PrismaPg driver adapter.
 * Required for Prisma 7.10 — PrismaClient cannot connect without an adapter.
 * DATABASE_URL (pooled) is used at runtime; DIRECT_URL takes priority if set.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require('@prisma/adapter-pg');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

function createPrismaClient(): PrismaClientType {
  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      '[prisma] DATABASE_URL is not set. Add it to .env.local before starting the server.'
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

// Prevent multiple client instances during Next.js hot-reload in development
const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClientType };

export const prisma: PrismaClientType =
  globalForPrisma._prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma._prisma = prisma;
}
