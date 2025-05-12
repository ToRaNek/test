// app/api/spotify/callback.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../utils/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { env } from '../../../utils/env';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login?error=NotAuthenticated', req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Erreur OAuth ou annulation par l'utilisateur
  if (error || !code) {
    return NextResponse.redirect(new URL('/profile?error=SpotifyAuthFailed', req.url));
  }

  try {
    // Échange du code contre un token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("Échec d'obtention du token Spotify");
    }

    // Récupération des infos du profil Spotify pour l'identifiant unique
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();

    if (!profileData.id) {
      throw new Error('Impossible de récupérer le profil Spotify');
    }

    // Stockage du compte Spotify dans notre DB
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'spotify',
          providerAccountId: profileData.id,
        },
      },
      update: {
        userId: session.user.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
        scope: tokenData.scope,
        tokenType: tokenData.token_type,
      },
      create: {
        userId: session.user.id,
        type: 'oauth',
        provider: 'spotify',
        providerAccountId: profileData.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
        scope: tokenData.scope,
        tokenType: tokenData.token_type,
      },
    });

    // Redirection vers la page profil avec succès
    return NextResponse.redirect(new URL('/profile?spotify=linked', req.url));
  } catch (error) {
    console.error('Erreur lors de la liaison Spotify:', error);
    return NextResponse.redirect(new URL('/profile?error=SpotifyLinkingFailed', req.url));
  }
}
