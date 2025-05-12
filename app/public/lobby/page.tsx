"use client";
import { useState, useEffect } from "react";
import { Room } from "../../types";

export default function Lobby() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [code, setCode] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/room");
                if (!response.ok) throw new Error("Erreur lors du chargement des rooms");
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error("Erreur:", error);
                setMsg("Erreur lors du chargement des rooms");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const createRoom = async () => {
        try {
            setIsLoading(true);
            const r = await fetch("/api/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rounds: 5, roundDuration: 30 })
            });
            const res = await r.json();
            if (res.code) window.location.href = `/room/${res.code}`;
            else setMsg("Création de room échouée");
        } catch (error) {
            console.error("Erreur:", error);
            setMsg("Erreur lors de la création de la room");
        } finally {
            setIsLoading(false);
        }
    };

    const joinRoom = async () => {
        if (!code) return setMsg("Code requis");
        try {
            setIsLoading(true);
            const r = await fetch(`/api/room/${code}/join`, { method: "POST" });
            const res = await r.json();
            if (res.joined) window.location.href = `/room/${code}`;
            else setMsg(res.error || "Erreur de join");
        } catch (error) {
            console.error("Erreur:", error);
            setMsg("Erreur lors de la tentative de rejoindre la room");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="font-bold text-xl">Lobby</h2>
            <button
                className="bg-accent text-white rounded px-4 py-2 my-4"
                onClick={createRoom}
                disabled={isLoading}
            >
                {isLoading ? "Chargement..." : "Créer une nouvelle partie"}
            </button>

            <h3 className="mt-4 font-semibold">Rooms ouvertes :</h3>
            {isLoading ? (
                <p>Chargement des rooms...</p>
            ) : (
                <ul className="mb-6">
                    {rooms.map((r) => (
                        <li key={r.code} className="py-2">
                            {r.code} ({r.players.length} joueurs)
                            <button
                                className="ml-3 underline text-accent"
                                onClick={() => {
                                    setCode(r.code);
                                    joinRoom();
                                }}
                            >
                                Rejoindre
                            </button>
                        </li>
                    ))}
                    {rooms.length === 0 && <li className="text-gray-400">Aucune room disponible pour le moment</li>}
                </ul>
            )}

            <div>
                <input
                    className="border p-1"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Entrer code"
                />
                <button
                    className="bg-accent text-white px-3 py-1 rounded ml-2"
                    onClick={joinRoom}
                    disabled={isLoading || !code}
                >
                    Rejoindre
                </button>
            </div>
            {msg && <div className="text-accent mt-2">{msg}</div>}
        </div>
    );
}