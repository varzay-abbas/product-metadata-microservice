const { PrismaClient:any } = require('@prisma/client');

const globalForPrisma = global as unknown as { prisma: typeof PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;