"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function SpotifySection({ linked, onLink, onUnlink }) {
  return (
    <div>
      <h3 className="font-bold mb-2">Spotify</h3>
      {!linked ? (
        <button
          className="bg-accent text-white rounded px-3 py-1"
          onClick={onLink}
        >Lier mon compte Spotify</button>
      ) : (
        <button
          className="bg-red-500 text-white rounded px-3 py-1"
          onClick={onUnlink}
        >Délier Spotify</button>
      )}
    </div>
  );
}

export default function Profile() {
  const { data: session } = useSession();
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(u => {
      if (u.pseudo) setPseudo(u.pseudo);
      if (u.image) setAvatar(u.image);
    });
    fetch("/api/spotify/link", { method: "POST" }).then(r => r.json()).then(l => {
      if (l && l.state) setSpotifyLinked(true); // Demo : à améliorer
    });
  }, []);

  const handleSave = async () => {
    const r = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, image: avatar })
    });
    const res = await r.json();
    setMsg(res.error ? res.error : "Profil mis à jour !");
  };

  const handleLinkSpotify = async () => {
    // Appelle /api/spotify/link pour fetcher l’URL puis redirige!
    const r = await fetch("/api/spotify/link", { method: "POST" });
    const data = await r.json();
    if (data.authUrl) window.location.href = data.authUrl;
  };

  const handleUnlinkSpotify = async () => {
    await fetch("/api/spotify/unlink", { method: "POST" });
    setSpotifyLinked(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Profil</h2>
      <div className="flex flex-col gap-4 mt-6">
        <label>
          <span>Pseudo :</span>
          <input className="ml-2 p-1" value={pseudo} onChange={e => setPseudo(e.target.value)}
                 placeholder="3-25 caractères, unique" minLength={3} maxLength={25} />
        </label>
        <label>
          <span>Avatar (URL, optionnel):</span>
          <input className="ml-2 p-1" value={avatar} onChange={e => setAvatar(e.target.value)} />
        </label>
        <button className="bg-accent rounded px-4 py-2 text-white mt-2" onClick={handleSave}>
          Sauver le profil
        </button>
        <SpotifySection linked={spotifyLinked} onLink={handleLinkSpotify} onUnlink={handleUnlinkSpotify} />
        {msg && <span className="text-accent">{msg}</span>}
      </div>
    </div>
  );
}