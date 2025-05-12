"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Room() {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Polling sur /api/room?code
    const intervalId = setInterval(() => {
      fetch("/api/room?code=" + roomCode)
        .then((res) => res.json())
        .then((data) => setPlayers(data.players || []));
    }, 3000);
    
    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [roomCode]);

  const ready = async () => {
    // TODO: POST pour ready ce player dans backend
    setMsg("Statut prêt envoyé.");
  };

  const startGame = async () => {
    // TODO: call api/game/start
    setMsg("Lancement…");
  };

  return (
    <div>
      <h2>Salle {roomCode}</h2>
      <h3>Joueurs :</h3>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} {p.ready ? "✅" : "❌"}
          </li>
        ))}
      </ul>
      <button className="bg-accent px-4 py-2 mt-4 rounded text-white" onClick={ready}>Je suis prêt</button>
      <button className="bg-accent px-4 py-2 ml-2 mt-4 rounded text-white" onClick={startGame}>Démarrer la partie</button>
      <span className="block text-accent">{msg}</span>
    </div>
  );
}
