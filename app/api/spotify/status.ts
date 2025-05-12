// app/api/spotify/status.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../utils/prisma";
import { authOptions } from "../auth/[...nextauth]";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Vérifier si l'utilisateur a un compte Spotify lié
    const spotifyAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "spotify",
      },
    });

    return NextResponse.json({
      linked: !!spotifyAccount,
      // Ne pas inclure les tokens sensibles dans la réponse
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du statut Spotify:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}