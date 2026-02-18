import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// @ts-ignore - Prisma 7 generated client
import { PrismaClient } from '../../../../generated/prisma/client.ts';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse DATABASE_URL (mysql://user:password@host:port/database) into individual params
// @prisma/adapter-mariadb uses the mariadb driver which works with MySQL too
const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: dbUrl.username || 'root',
  password: dbUrl.password || undefined,
  database: dbUrl.pathname.replace(/^\//, '') || undefined,
});

// Initialize Prisma Client with driver adapter (required by Prisma 7)
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
