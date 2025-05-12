// app/api/room/[code]/ready.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../utils/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Trouver la room
  const room = await prisma.room.findUnique({
    where: { code: params.code },
  });

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Trouver le joueur dans cette room
  const player = await prisma.player.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId: room.id,
      },
    },
  });

  if (!player) {
    return NextResponse.json({ error: 'Player not in this room' }, { status: 403 });
  }

  // Mettre à jour le statut "prêt" du joueur
  await prisma.player.update({
    where: { id: player.id },
    data: { ready: true },
  });

  return NextResponse.json({ ok: true });
}
