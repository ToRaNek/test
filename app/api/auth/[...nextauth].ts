import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../utils/prisma";
import { env } from "../../../utils/env"; // Sécuriser .env usage

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
    // SpotifyProvider à NE PAS activer ici (liaison sur /profile)
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user, token }) {
      // Inclure userId/pseudo dans la session
      session.user.id = user?.id || token.sub;
      session.user.pseudo = user?.pseudo || null;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Interdire signup direct, uniquement via Google/Discord
      if (
        account.provider !== "google" &&
        account.provider !== "discord"
      ) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=OAuthError",
    // Pas de signUp page !
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);