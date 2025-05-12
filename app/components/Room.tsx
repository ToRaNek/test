// app/components/Room.tsx
import React from "react";
import { Player } from "../types";

interface RoomProps {
    roomCode: string;
    players: Player[];
    onReady: () => void;
    onStart: () => void;
}

export function Room({ roomCode, players, onReady, onStart }: RoomProps) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Salle {roomCode}</h2>

            <div className="bg-secondary p-4 rounded mb-4">
                <h3 className="text-lg font-semibold mb-2">Joueurs</h3>
                <ul className="space-y-2">
                    {players.map((p) => (
                        <li key={p.id} className="flex items-center justify-between">
                            <span>{p.user?.name || "Joueur"}</span>
                            <span className="ml-4">{p.ready ? "✅" : "❌"}</span>
                        </li>
                    ))}
                </ul>

                {players.length === 0 && (
                    <p className="text-gray-400 italic">Aucun joueur n&apos;a encore rejoint...</p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    className="bg-accent p-2 rounded text-white"
                    onClick={onReady}
                >
                    Je suis prêt
                </button>
                <button
                    className="bg-accent p-2 rounded text-white"
                    onClick={onStart}
                >
                    Démarrer la partie
                </button>
            </div>
        </div>
    );
}