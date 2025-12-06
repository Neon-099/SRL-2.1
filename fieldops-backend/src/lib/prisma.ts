import { PrismaClient } from '@prisma/client/extension';

import {DATABASE_URL, NODE_ENV } from '../config/env.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;