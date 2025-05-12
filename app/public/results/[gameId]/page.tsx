"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface GameResults {
    results: Record<string, number>;
    state: string;
}

export default function Results() {
    const { gameId } = useParams<{ gameId: string }>();
    const [result, setResult] = useState<GameResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/game/results?gameId=${gameId}`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data: GameResults = await response.json();
                setResult(data);
            } catch (error) {
                console.error("Erreur lors du chargement des résultats:", error);
                setError("Impossible de charger les résultats du jeu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [gameId]);

    if (isLoading) {
        return <div>Chargement résultats...</div>;
    }

    if (error || !result) {
        return <div className="text-red-500">{error || "Erreur lors du chargement des résultats"}</div>;
    }

    // Trier les scores par ordre décroissant
    const sortedResults = Object.entries(result.results || {})
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Résultats finaux</h2>

            {sortedResults.length > 0 ? (
                <ul className="space-y-2 mb-8">
                    {sortedResults.map(([pseudo, score], index) => (
                        <li key={pseudo} className={`p-2 flex justify-between items-center ${index === 0 ? 'bg-accent bg-opacity-20 rounded' : ''}`}>
                            <div className="flex items-center">
                                <span className="font-bold mr-3">{index + 1}.</span>
                                <span className={index === 0 ? 'font-bold' : ''}>{pseudo}</span>
                            </div>
                            <span className="font-bold">{score} points</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mb-8">Aucun résultat disponible</p>
            )}

            <div className="flex gap-4 mt-5">
                <Link href="/lobby" className="bg-accent px-4 py-2 rounded text-white">
                    Retour lobby
                </Link>
                <Link href={`/game/${gameId}`} className="bg-accent px-4 py-2 rounded text-white">
                    Rejouer
                </Link>
            </div>
        </div>
    );
}