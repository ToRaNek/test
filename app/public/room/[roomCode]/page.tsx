'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Player } from '../../../types';

interface RoomData {
  id: string;
  code: string;
  status: string;
  players: Player[];
}

export default function Room() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Polling de l'API pour obtenir les joueurs dans la room
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/room?code=${roomCode}`);
        if (!response.ok) throw new Error('Erreur lors du chargement de la room');

        const data: RoomData = await response.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.error('Erreur:', error);
        setMsg('Erreur lors du chargement des données de la room');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    // Polling toutes les 3 secondes
    const intervalId = setInterval(fetchRoomData, 3000);

    // Nettoyage à la démonter du composant
    return () => clearInterval(intervalId);
  }, [roomCode]);

  const ready = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/room/${roomCode}/ready`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi du statut prêt");

      setMsg('Statut prêt envoyé');
    } catch (error) {
      console.error('Erreur:', error);
      setMsg("Erreur lors de l'envoi du statut prêt");
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });

      if (!response.ok) throw new Error('Erreur lors du lancement de la partie');

      const data = await response.json();

      if (data.gameId) {
        window.location.href = `/game/${data.gameId}`;
      } else {
        setMsg('Échec du lancement de la partie');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMsg('Erreur lors du lancement de la partie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Salle {roomCode}</h2>

      {isLoading ? (
        <p>Chargement des joueurs...</p>
      ) : (
        <>
          <h3>Joueurs :</h3>
          <ul className="my-4">
            {players.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-1">
                <span>{p.user?.name || 'Joueur inconnu'}</span>
                <span className="ml-4">{p.ready ? '✅' : '❌'}</span>
              </li>
            ))}
            {players.length === 0 && <li className="text-gray-400">Aucun joueur dans la salle</li>}
          </ul>
        </>
      )}

      <div className="flex space-x-4 mt-4">
        <button
          className="bg-accent px-4 py-2 rounded text-white"
          onClick={ready}
          disabled={isLoading}
        >
          Je suis prêt
        </button>
        <button
          className="bg-accent px-4 py-2 rounded text-white"
          onClick={startGame}
          disabled={isLoading || players.length < 1}
        >
          Démarrer la partie
        </button>
      </div>

      {msg && <span className="block text-accent mt-4">{msg}</span>}
    </div>
  );
}
