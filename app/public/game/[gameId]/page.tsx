// app/public/game/[gameId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Game as GameType, Question } from "../../../types";

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const [state, setState] = useState<GameType | null>(null);
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Polling pour l'état du jeu
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/game/state?gameId=${gameId}`);
        if (!response.ok) throw new Error("Erreur lors du chargement de l'état du jeu");

        const gameState: GameType = await response.json();
        setState(gameState);
      } catch (error) {
        console.error("Erreur:", error);
        setMsg("Erreur lors du chargement de l'état du jeu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameState();

    // Polling toutes les 3 secondes
    const poll = setInterval(fetchGameState, 3000);

    // Nettoyage
    return () => clearInterval(poll);
  }, [gameId]);

  // Soumettre une réponse
  const submit = async () => {
    if (!answer.trim()) {
      setMsg("Veuillez entrer une réponse");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, answer })
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la réponse");

      setMsg("Réponse envoyée !");
      setAnswer("");
    } catch (error) {
      console.error("Erreur:", error);
      setMsg("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsLoading(false);
    }
  };

  // Pendant le chargement initial
  if (isLoading && !state) {
    return <div>Chargement du jeu...</div>;
  }

  // Si l'état n'est pas disponible
  if (!state) {
    return <div>Impossible de charger l&apos;état du jeu. {msg}</div>;
  }

  // Questions et question actuelle
  const currentIndex = state.currentQuestionIndex || 0;
  const currentQuestion = state.questions?.[currentIndex] as Question | undefined;

  return (
      <div>
        <h2>Question #{currentIndex + 1}</h2>

        {currentQuestion ? (
            <div className="my-4">
              <p className="text-lg">{currentQuestion.question}</p>

              {currentQuestion.type === "audio" && currentQuestion.previewUrl && (
                  <audio
                      src={currentQuestion.previewUrl}
                      controls
                      autoPlay
                      className="my-4"
                  />
              )}

              <div className="my-4">
                <input
                    className="border p-2 rounded"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    disabled={isLoading}
                />
                <button
                    className="bg-accent ml-2 px-3 py-2 rounded text-white"
                    onClick={submit}
                    disabled={isLoading || !answer.trim()}
                >
                  Soumettre
                </button>
              </div>
            </div>
        ) : (
            <p>Aucune question disponible</p>
        )}

        <h3 className="font-semibold mt-6">Classement live :</h3>
        <ul className="space-y-1 mt-2">
          {Object.entries(state.scores || {}).map(([joueur, score]) => (
              <li key={joueur} className="flex justify-between">
                <span>{joueur}</span>
                <span className="font-bold">{score}</span>
              </li>
          ))}
          {Object.keys(state.scores || {}).length === 0 && (
              <li className="text-gray-400">Aucun score pour le moment</li>
          )}
        </ul>

        {msg && (
            <div className="text-accent mt-4 p-2 bg-opacity-20 bg-accent-light rounded">
              {msg}
            </div>
        )}
      </div>
  );
}