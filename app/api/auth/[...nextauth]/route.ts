// app/api/auth/routes.ts - Mise à jour
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../../utils/prisma';
import { env } from '../../../../utils/env';


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: env.NEXTAUTH_SECRET,  // Assurez-vous que cette ligne est présente
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.pseudo = user.pseudo || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.pseudo = token.pseudo as string | null;
      }
      return session;
    },
    async signIn({ account }) {
      if (account?.provider !== 'google' && account?.provider !== 'discord') {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=OAuthError',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
