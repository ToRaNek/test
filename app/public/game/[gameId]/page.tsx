"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Game() {
  const { gameId } = useParams();
  const [state, setState] = useState(null);
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const poll = setInterval(() => {
      fetch("/api/game/state?gameId=" + gameId)
        .then((res) => res.json())
        .then((s) => setState(s));
    }, 3000);
    return () => clearInterval(poll);
  }, [gameId]);

  const submit = async () => {
    await fetch("/api/game/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, answer })
    });
    setMsg("Réponse envoyée !");
  };

  if (!state) return <div>Chargement…</div>;
  const current = state.questions?.[state.currentQuestionIndex ?? 0];

  return (
    <div>
      <h2>Question #{state.currentQuestionIndex + 1}</h2>
      {current && (
        <div>
          {current.type === "audio" && (
            <audio src={current.previewUrl} controls autoPlay />
          )}
          <div className="my-4">
            <input className="border p-1" value={answer} onChange={e => setAnswer(e.target.value)} />
            <button className="bg-accent ml-2 px-3 py-1 rounded text-white" onClick={submit}>Soumettre</button>
          </div>
        </div>
      )}
      <h3>Classement live :</h3>
      <ul>
        {Object.entries(state.scores || {}).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
      <div className="text-accent">{msg}</div>
    </div>
  );
}