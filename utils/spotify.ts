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

  if (!account?.refresh_token) return null;

  // Si le token est encore valide, on le retourne
  const now = Math.floor(Date.now() / 1000);
  if (account.access_token && account.expires_at && account.expires_at > now + 60) {
    return account.access_token;
  }

  // Sinon, on rafraîchit le token
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: account.refresh_token,
      }),
      cache: 'no-cache', // Important pour éviter les problèmes de mise en cache
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du rafraîchissement du token: ${response.status}`);
    }

    const data = await response.json();

    if (!data.access_token) return null;

    // Mise à jour du token en base
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
        refresh_token: data.refresh_token ?? account.refresh_token, // Garder l'ancien refresh token si pas de nouveau
        scope: data.scope ?? account.scope,
      },
    });

    return data.access_token;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token Spotify:', error);
    return null;
  }
}

/**
 * Génère une URL d'autorisation pour lier un compte Spotify
 * @param state Chaîne aléatoire pour sécurité CSRF
 * @returns URL d'autorisation Spotify
 */
export function getSpotifyAuthorizationUrl(state: string): string {
  const scope = [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    scope,
    state,
    show_dialog: 'true',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}
