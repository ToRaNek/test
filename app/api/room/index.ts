import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../utils/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const CreateRoomSchema = z.object({
  rounds: z.number().min(1).max(20),
  roundDuration: z.number().min(10).max(90),
});

function genRoomCode(length = 6): string {
  return Array.from(
    { length },
    () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)],
  ).join('');
}

export async function GET() {
  // Liste des rooms ouvertes
  const rooms = await prisma.room.findMany({
    where: { status: 'open' },
    select: {
      id: true,
      code: true,
      status: true,
      createdAt: true,
      hostId: true,
      players: { select: { userId: true } },
    },
  });
  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const safe = CreateRoomSchema.safeParse(data);
  if (!safe.success) {
    return NextResponse.json({ error: safe.error.format() }, { status: 400 });
  }
  const code = genRoomCode();
  const { rounds, roundDuration } = safe.data;
  const room = await prisma.room.create({
    data: {
      code,
      hostId: session.user.id,
      status: 'open',
    },
  });
  await prisma.player.create({
    data: {
      userId: session.user.id,
      roomId: room.id,
      score: 0,
      ready: false,
      ranking: null,
    },
  });
  return NextResponse.json({ ...room, rounds, roundDuration });
}
