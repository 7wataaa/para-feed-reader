import { PrismaClient } from '@prisma/client';

/* 
Next.jsの開発環境にて、
"Error querying the database: db error: FATAL: 現在クライアント数が多すぎます"
というエラーが起こるため、PrismaClientをグローバルにキャッシュする

参考: https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
