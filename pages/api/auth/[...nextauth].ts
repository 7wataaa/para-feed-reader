import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../../../prisma/PrismaClient';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      },
    }),
    signIn: async ({ user, account, profile, email, credentials }) => {
      await prisma.feedOrder.create({
        data: {
          userId: user.id,
          feedIdOrder: [],
        },
      });

      return true;
    },
  },
});
