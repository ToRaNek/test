"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SpotifySectionProps {
  linked: boolean;
  onLink: () => Promise<void>;
  onUnlink: () => Promise<void>;
}

function SpotifySection({ linked, onLink, onUnlink }: SpotifySectionProps) {
  return (
      <div>
        <h3 className="font-bold mb-2">Spotify</h3>
        {!linked ? (
            <button
                className="bg-accent text-white rounded px-3 py-1"
                onClick={onLink}
            >
              Lier mon compte Spotify
            </button>
        ) : (
            <button
                className="bg-red-500 text-white rounded px-3 py-1"
                onClick={onUnlink}
            >
              Délier Spotify
            </button>
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Récupérer le profil utilisateur
        const profileRes = await fetch("/api/profile");
        const userData = await profileRes.json();

        if (userData.pseudo) setPseudo(userData.pseudo);
        if (userData.image) setAvatar(userData.image);

        // Vérifier le statut de liaison Spotify
        const spotifyRes = await fetch("/api/spotify/status", { method: "GET" });
        const spotifyData = await spotifyRes.json();

        setSpotifyLinked(spotifyData.linked || false);
      } catch (error) {
        console.error("Erreur:", error);
        setMsg("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, image: avatar })
      });

      const res = await r.json();

      if (res.error) {
        setMsg(res.error);
      } else {
        setMsg("Profil mis à jour !");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMsg("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkSpotify = async () => {
    try {
      setIsLoading(true);
      const r = await fetch("/api/spotify/link", { method: "POST" });
      const data = await r.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setMsg("Erreur: URL d'authentification manquante");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMsg("Erreur lors de la liaison Spotify");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkSpotify = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/spotify/unlink", { method: "POST" });
      setSpotifyLinked(false);
      setMsg("Compte Spotify délié avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      setMsg("Erreur lors de la déliaison Spotify");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <div>Veuillez vous connecter pour accéder à votre profil.</div>;
  }

  return (
      <div>
        <h2 className="text-xl font-bold">Profil</h2>
        {isLoading ? (
            <p>Chargement...</p>
        ) : (
            <div className="flex flex-col gap-4 mt-6">
              <label>
                <span>Pseudo :</span>
                <input
                    className="ml-2 p-1"
                    value={pseudo}
                    onChange={e => setPseudo(e.target.value)}
                    placeholder="3-25 caractères, unique"
                    minLength={3}
                    maxLength={25}
                />
              </label>
              <label>
                <span>Avatar (URL, optionnel):</span>
                <input
                    className="ml-2 p-1"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                />
              </label>
              <button
                  className="bg-accent rounded px-4 py-2 text-white mt-2"
                  onClick={handleSave}
                  disabled={isLoading}
              >
                Sauver le profil
              </button>

              <SpotifySection
                  linked={spotifyLinked}
                  onLink={handleLinkSpotify}
                  onUnlink={handleUnlinkSpotify}
              />

              {msg && <span className="text-accent">{msg}</span>}
            </div>
        )}
      </div>
  );
}