'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Room } from '../../types';

export default function Lobby() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/room');
        if (!response.ok) throw new Error('Erreur lors du chargement des rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Erreur:', error);
        setMsg('Erreur lors du chargement des rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();

    // Polling toutes les 10 secondes pour actualiser la liste des rooms
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const createRoom = async () => {
    try {
      setIsLoading(true);
      const r = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rounds: 5, roundDuration: 30 }),
      });
      const res = await r.json();
      if (res.code) router.push(`/room/${res.code}`);
      else setMsg('Création de room échouée');
    } catch (error) {
      console.error('Erreur:', error);
      setMsg('Erreur lors de la création de la room');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!code) return setMsg('Code requis');
    try {
      setIsLoading(true);
      const r = await fetch(`/api/room/${code}/join`, { method: 'POST' });
      const res = await r.json();
      if (res.joined) router.push(`/room/${code}`);
      else setMsg(res.error || 'Erreur de join');
    } catch (error) {
      console.error('Erreur:', error);
      setMsg('Erreur lors de la tentative de rejoindre la room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lobby</h1>
          <p className="text-gray-400">Créez ou rejoignez une partie de Devine la Zik</p>
          <div className="flex gap-4 mt-4">
            <Link href="/public/lobby" className="bg-accent px-4 py-2 rounded text-white">
              Retour lobby
            </Link>
            <Link href="/public/profile" className="bg-accent px-4 py-2 rounded text-white">
              Profil
            </Link>
          </div>
        </div>

        <div className="p-6 bg-secondary rounded-lg shadow-sm">
          <button
              className="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent/90 transition-colors"
              onClick={createRoom}
              disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Créer une nouvelle partie'}
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Parties en cours</h2>
            {isLoading && rooms.length === 0 ? (
                <div className="animate-pulse text-gray-400">Chargement des rooms...</div>
            ) : (
                <ul className="space-y-3 mb-6">
                  {rooms.map((r) => (
                      <li key={r.code} className="p-3 bg-primary rounded border border-gray-700 flex justify-between items-center">
                        <div>
                          <span className="font-mono bg-gray-700 text-xs px-2 py-1 rounded">{r.code}</span>
                          <span className="ml-3 text-gray-300">{r.players.length} joueurs</span>
                        </div>
                        <button
                            className="text-accent hover:underline"
                            onClick={() => {
                              setCode(r.code);
                              joinRoom();
                            }}
                        >
                          Rejoindre
                        </button>
                      </li>
                  ))}
                  {rooms.length === 0 && (
                      <li className="text-gray-400 py-3 text-center">Aucune room disponible pour le moment</li>
                  )}
                </ul>
            )}

            <div className="mt-6 p-4 border border-gray-700 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Rejoindre avec un code</h3>
              <div className="flex">
                <input
                    className="bg-primary border border-gray-700 p-2 rounded-l flex-1"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Entrer code (ex: ABCDEF)"
                    maxLength={6}
                />
                <button
                    className="bg-accent text-white px-4 py-2 rounded-r hover:bg-accent/90 transition-colors disabled:opacity-50"
                    onClick={joinRoom}
                    disabled={isLoading || !code}
                >
                  Rejoindre
                </button>
              </div>
            </div>
          </div>
        </div>

        {msg && (
            <div className="bg-red-500/20 border border-red-600 text-red-200 p-3 rounded">
              {msg}
            </div>
        )}
      </div>
  );
}
