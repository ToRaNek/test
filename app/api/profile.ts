// app/api/profile.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../utils/prisma';
import { authOptions } from './auth/[...nextauth]/route';
import { z } from 'zod';

const ProfileSchema = z.object({
  pseudo: z
    .string()
    .min(3)
    .max(25)
    .regex(/^[a-zA-Z0-9_-]+$/),
  image: z.string().url().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      pseudo: true,
    },
  });
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const safe = ProfileSchema.safeParse(data);
  if (!safe.success) {
    return NextResponse.json({ error: safe.error.format() }, { status: 400 });
  }
  const { pseudo, image } = safe.data;
  // Unique pseudo enforced by DB
  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { pseudo, image },
      select: { id: true, pseudo: true, image: true },
    });
    return NextResponse.json(user);
  } catch (e: unknown) {
    if (e instanceof Error && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'Pseudo already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
