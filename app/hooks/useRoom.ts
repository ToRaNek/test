// app/hooks/useRoom.ts
import { useState, useEffect } from 'react';
import { Player } from '../types';

interface UseRoomReturn {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  ready: () => Promise<void>;
  start: () => Promise<{ gameId?: string; error?: string }>;
}

export function useRoom(roomCode: string): UseRoomReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/room/${roomCode}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPlayers(data.players || []);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement de la room:', error);
        setError('Impossible de charger les données de la room');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    // Polling toutes les 3 secondes
    const poll = setInterval(fetchRoomData, 3000);
    return () => clearInterval(poll);
  }, [roomCode]);

  const ready = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/room/${roomCode}/ready`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du statut prêt:", error);
      setError("Erreur lors de l'envoi du statut prêt");
    } finally {
      setIsLoading(false);
    }
  };

  const start = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomCode }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { gameId: data.gameId };
    } catch (error) {
      console.error('Erreur lors du lancement de la partie:', error);
      setError('Erreur lors du lancement de la partie');
      return { error: 'Échec du lancement de la partie' };
    } finally {
      setIsLoading(false);
    }
  };

  return { players, isLoading, error, ready, start };
}
