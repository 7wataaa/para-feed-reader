import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../../../prisma/PrismaClient';
import 'dotenv/config'; // https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export default NextAuth({
  secret: process.env.NEXTAUTH_URL,
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
  },
});
