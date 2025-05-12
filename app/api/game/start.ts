// app/api/game/start.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../utils/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// Stub out la génération de questions à partir des Spotify pools des joueurs
async function generateQuestionsForRoom(_roomID: string) {
  // Dans un vrai système, on combinerait tous les prefs musique,
  // puis fetcherait les tracks via les tokens refreshés players,
  // ici on mock des questions (à remplacer par requêtes Spotify réelles).
  // Réduit à une question demo :
  return [
    {
      type: 'audio',
      question: 'Quel est ce morceau ?',
      previewUrl: 'https://p.scdn.co/mp3-preview/demo.mp3',
      correct: 'Some track',
      choices: ['Some track', 'Track 2', 'Track 3', 'Track 4'],
    },
  ];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { roomId } = await req.json();
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  // TODO: check if host, etc.

  const questions = await generateQuestionsForRoom(roomId);
  const game = await prisma.game.create({
    data: {
      roomId,
      state: 'running',
      questions,
      scores: {},
      currentQuestionIndex: 0,
    },
  });
  await prisma.room.update({ where: { id: roomId }, data: { status: 'playing' } });
  return NextResponse.json({ ok: true, gameId: game.id });
}
