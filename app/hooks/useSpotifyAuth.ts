import { useState } from "react";
export function useSpotifyAuth() {
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const link = async () => {
    const r = await fetch("/api/spotify/link", { method: "POST" });
    const d = await r.json();
    if (d.authUrl) window.location.href = d.authUrl;
  };
  const unlink = async () => {
    await fetch("/api/spotify/unlink", { method: "POST" });
    setSpotifyLinked(false);
  };
  return { spotifyLinked, link, unlink };
}