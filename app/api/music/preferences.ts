// app/api/music/preferences.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../utils/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import { z } from 'zod';

const MusicPrefsSchema = z.object({
  selectedPlaylistIds: z.array(z.string().min(1)).min(1),
  useLikedTracks: z.boolean(),
  useHistory: z.boolean(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await prisma.musicPreference.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const safe = MusicPrefsSchema.safeParse(data);
  if (!safe.success) {
    return NextResponse.json({ error: safe.error.format() }, { status: 400 });
  }

  // Persist/update or create
  const { selectedPlaylistIds, useLikedTracks, useHistory } = safe.data;
  const pref = await prisma.musicPreference.upsert({
    where: { userId: session.user.id },
    update: {
      selectedPlaylistIds: JSON.stringify(selectedPlaylistIds),
      useLikedTracks,
      useHistory,
    },
    create: {
      userId: session.user.id,
      selectedPlaylistIds: JSON.stringify(selectedPlaylistIds),
      useLikedTracks,
      useHistory,
    },
  });

  return NextResponse.json(pref);
}
