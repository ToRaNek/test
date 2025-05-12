import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../utils/prisma';
import { authOptions } from '../../auth/[...nextauth]';

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Find la room
  const room = await prisma.room.findUnique({
    where: { code: params.code, status: 'open' },
  });
  if (!room) {
    return NextResponse.json({ error: 'Room not found or closed' }, { status: 404 });
  }
  // Create player or upsert
  let player = await prisma.player.findUnique({
    where: { userId_roomId: { userId: session.user.id, roomId: room.id } },
  });
  if (!player) {
    player = await prisma.player.create({
      data: { userId: session.user.id, roomId: room.id },
    });
  }
  return NextResponse.json({ joined: true, roomId: room.id });
}
