import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { env } from "../../../utils/env";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Génère 'state' pour CSRF
  const state = crypto.randomBytes(16).toString("hex");
  // On pourrait le stocker côté bdd/session si on veut le valider plus tard

  const scope = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    scope,
    state,
    show_dialog: "true"
  });

  return NextResponse.json({
    authUrl: `https://accounts.spotify.com/authorize?${params.toString()}`,
    state,
  });
}