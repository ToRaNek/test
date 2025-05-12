"use client";
import { useState, useEffect } from "react";

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/room").then(res => res.json()).then(setRooms);
  }, []);

  const createRoom = async () => {
    const r = await fetch("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rounds: 5, roundDuration: 30 })
    });
    const res = await r.json();
    if (res.code) window.location.href = `/room/${res.code}`;
    else setMsg("Création de room échouée");
  };

  const joinRoom = async () => {
    if (!code) return setMsg("Code requis");
    const r = await fetch(`/api/room/${code}/join`, { method: "POST" });
    const res = await r.json();
    if (res.joined) window.location.href = `/room/${code}`;
    else setMsg(res.error || "Erreur de join");
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Lobby</h2>
      <button className="bg-accent text-white rounded px-4 py-2 my-4" onClick={createRoom}>Créer une nouvelle partie</button>
      <h3 className="mt-4 font-semibold">Rooms ouvertes :</h3>
      <ul className="mb-6">
        {rooms.map((r) => (
          <li key={r.code}>{r.code} ({r.players.length} joueurs)</li>
        ))}
      </ul>
      <div>
        <input className="border p-1" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Entrer code" />
        <button className="bg-accent text-white px-3 py-1 rounded ml-2" onClick={joinRoom}>Rejoindre</button>
      </div>
      {msg && <div className="text-accent mt-2">{msg}</div>}
    </div>
  );
}