// app/api/spotify/unlink.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../utils/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.account.deleteMany({
    where: {
      userId: session.user.id,
      provider: 'spotify',
    },
  });

  return NextResponse.json({ ok: true });
}
