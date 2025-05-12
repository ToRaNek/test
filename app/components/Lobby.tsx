// app/components/Lobby.tsx
import React from 'react';
import { Room } from '../types';

interface LobbyProps {
  rooms: Room[];
  onCreate: () => void;
  onJoin: (code: string) => void;
}

export function Lobby({ rooms, onCreate, onJoin }: LobbyProps) {
  return (
    <div>
      <h2>Lobby</h2>
      <button className="bg-accent p-2 rounded text-white" onClick={onCreate}>
        Créer une partie
      </button>

      <ul className="mt-4">
        {rooms.map((r) => (
          <li key={r.code} className="py-2 border-b border-secondary">
            Code: <b>{r.code}</b> ({r.players.length} joueurs)
            <button className="ml-2 underline" onClick={() => onJoin(r.code)}>
              Rejoindre
            </button>
          </li>
        ))}
      </ul>

      {rooms.length === 0 && (
        <p className="mt-4 text-gray-400">Aucune partie disponible actuellement. Créez-en une !</p>
      )}
    </div>
  );
}
