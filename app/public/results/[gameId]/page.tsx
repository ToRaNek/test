"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Results() {
  const { gameId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/game/results?gameId=" + gameId)
      .then(res => res.json())
      .then(setResult);
  }, [gameId]);

  if (!result) return <div>Chargement résultats…</div>;
  return (
    <div>
      <h2>Résultats finaux</h2>
      <ul>
        {Object.entries(result.results || {}).map(([pseudo, score]: any) => (
          <li key={pseudo}>{pseudo}: {score}</li>
        ))}
      </ul>
      <div className="flex gap-4 mt-5">
        <a href="/lobby" className="bg-accent px-4 py-2 rounded text-white">Retour lobby</a>
        <a href={`/game/${gameId}`} className="bg-accent px-4 py-2 rounded text-white">Rejouer</a>
      </div>
    </div>
  );
}