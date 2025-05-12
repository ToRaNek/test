// utils/spotify.ts
import { prisma } from './prisma';
import { env } from './env';

/**
 * Récupère ou rafraîchit le token d'accès Spotify pour un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Token d'accès Spotify ou null si l'utilisateur n'a pas lié son compte
 */
export async function getSpotifyAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'spotify',
    },
  });

  if (!account?.refreshToken) return null;

  // Si le token est encore valide, on le retourne
  const now = Math.floor(Date.now() / 1000);
  if (account.expiresAt && account.accessToken && account.expiresAt > now + 60) {
    return account.accessToken;
  }

  // Sinon, on rafraîchit le token
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: account.refreshToken,
      client_id: env.SPOTIFY_CLIENT_ID,
      client_secret: env.SPOTIFY_CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  if (!data.access_token) return null;

  // Mise à jour du token en base
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
