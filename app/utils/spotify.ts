import { prisma } from "./prisma";
import { env } from "./env";

export async function getSpotifyAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "spotify",
    },
  });
  if (!account?.refreshToken) return null;

  // Si token encore valide, on le garde, sinon "refresh"
  const now = Math.floor(Date.now() / 1000);
  if (account.expiresAt && account.accessToken && account.expiresAt > now + 60) {
    return account.accessToken;
  }
  // Sinon refresh
  const refresh = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
      client_id: env.SPOTIFY_CLIENT_ID,
      client_secret: env.SPOTIFY_CLIENT_SECRET,
    }),
  });
  const data = await refresh.json();

  if (!data.access_token) return null;
  await prisma.account.update({
    where: { id: account.id },
    data: {
      accessToken: data.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
      refreshToken: data.refresh_token ?? account.refreshToken,
      scope: data.scope ?? account.scope,
    },
  });
  return data.access_token;
}