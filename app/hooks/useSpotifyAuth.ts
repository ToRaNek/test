'use client';
import { useState, useEffect } from 'react';

interface SpotifyAuthState {
  spotifyLinked: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useSpotifyAuth() {
  const [state, setState] = useState<SpotifyAuthState>({
    spotifyLinked: false,
    isLoading: true,
    error: null,
  });

  // Vérifier si l'utilisateur a lié son compte Spotify au chargement
  useEffect(() => {
    const checkSpotifyLink = async () => {
      try {
        const response = await fetch('/api/spotify/status');

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setState({
          spotifyLinked: data.linked,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erreur lors de la vérification du lien Spotify:', error);
        setState({
          spotifyLinked: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    };

    checkSpotifyLink();
  }, []);

  // Fonction pour lier un compte Spotify
  const link = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/spotify/link', { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("URL d'authentification manquante");
      }
    } catch (error) {
      console.error('Erreur lors de la liaison Spotify:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      }));
    }
  };

  // Fonction pour délier un compte Spotify
  const unlink = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/spotify/unlink', { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      setState({
        spotifyLinked: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur lors de la déliaison Spotify:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      }));
    }
  };

  return {
    spotifyLinked: state.spotifyLinked,
    isLoading: state.isLoading,
    error: state.error,
    link,
    unlink,
  };
}