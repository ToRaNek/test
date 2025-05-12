// app/api/music/playlists.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getSpotifyAccessToken } from '../../../utils/spotify'; // à implémenter util

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Récup token Spotify en base (refresh si expiré)
  const accessToken = await getSpotifyAccessToken(session.user.id);
  if (!accessToken) {
    return NextResponse.json({ error: 'Spotify not linked' }, { status: 403 });
  }

  // Call l'API Spotify via backend
  const r = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await r.json();
  return NextResponse.json(data); // pris tel quel, à mapper côté front si besoin
}
