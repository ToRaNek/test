import React from "react";
export function Results({ scores, onReplay, onToLobby }: any) {
  return (
    <div>
      <h2>Résultats</h2>
      <ul>
        {Object.entries(scores).map(([k, v]: any) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
      <div className="flex gap-4">
        <button className="bg-accent px-4 py-2 rounded text-white" onClick={onToLobby}>Retour lobby</button>
        <button className="bg-accent px-4 py-2 rounded text-white" onClick={onReplay}>Rejouer</button>
      </div>
    </div>
  );
}