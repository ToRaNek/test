import React from "react";
export function Room({ roomCode, players, onReady, onStart }: any) {
  return (
    <div>
      <h2>Salle {roomCode}</h2>
      <ul>
        {players.map((p: any) => (
          <li key={p.id}>
            {p.name} {p.ready ? "✅" : "❌"}
          </li>
        ))}
      </ul>
      <button className="bg-accent p-2 rounded text-white mt-2" onClick={onReady}>Prêt</button>
      <button className="bg-accent p-2 rounded text-white mt-2 ml-2" onClick={onStart}>Démarrer</button>
    </div>
  );
}