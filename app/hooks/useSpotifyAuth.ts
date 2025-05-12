'use client';
import { useState, useEffect } from 'react';

interface SpotifyAuthResponse {
  authUrl?: string;
  state?: string;
  error?: string;
}

export function useSpotifyAuth() {
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur a lié son compte Spotify au chargement
  useEffect(() => {
    const checkSpotifyLink = async () => {
      try {
        const response = await fetch('/api/spotify/link', { method: 'POST' });
        const data: SpotifyAuthResponse = await response.json();

        // Si nous avons un 'state', cela signifie qu'un compte est lié
        // Dans un vrai système, on aurait un endpoint spécifique pour vérifier
        setSpotifyLinked(!!data.state);
      } catch (error) {
        console.error('Erreur lors de la vérification du lien Spotify:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSpotifyLink();
  }, []);

  // Fonction pour lier un compte Spotify
  const link = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/spotify/link', { method: 'POST' });
      const data: SpotifyAuthResponse = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        console.error("Erreur: URL d'authentification manquante");
      }
    } catch (error) {
      console.error('Erreur lors de la liaison Spotify:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour délier un compte Spotify
  const unlink = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/spotify/unlink', { method: 'POST' });
      setSpotifyLinked(false);
    } catch (error) {
      console.error('Erreur lors de la déliaison Spotify:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    spotifyLinked,
    link,
    unlink,
    isLoading,
  };
}
