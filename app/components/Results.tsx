// app/components/Results.tsx
import React from "react";

interface ResultsProps {
    scores: Record<string, number>;
    onReplay: () => void;
    onToLobby: () => void;
}

export function Results({ scores, onReplay, onToLobby }: ResultsProps) {
    return (
        <div>
            <h2>Résultats</h2>
            <ul>
                {Object.entries(scores).map(([k, v]) => (
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