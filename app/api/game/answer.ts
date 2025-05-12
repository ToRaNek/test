// app/api/game/answer.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../utils/prisma";
import { authOptions } from "../auth/[...nextauth]";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { gameId, userAnswer } = await req.json();
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  // Ici, on mock le process: marquer score/avancement/sauver réponse
  // TODO: match correct, maj scores, next, faire polling sur state
  // À adapter selon pool réel.

  return NextResponse.json({ ok: true });
}