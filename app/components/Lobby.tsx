import React from "react";

export function Lobby({ rooms, onCreate, onJoin }: any) {
  return (
    <div>
      <h2>Lobby</h2>
      <button className="bg-accent p-2 rounded text-white" onClick={onCreate}>Créer une partie</button>
      <ul>
        {rooms.map((r: any) => (
          <li key={r.code}>
            Code: <b>{r.code}</b> ({r.players.length} joueurs)
            <button className="ml-2 underline" onClick={() => onJoin(r.code)}>Rejoindre</button>
          </li>
        ))}
      </ul>
    </div>
  );
}