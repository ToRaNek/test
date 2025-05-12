// app/hooks/useLobby.ts
import { useState, useEffect } from "react";
import { Room } from "../types";

interface UseLobbyReturn {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  create: () => Promise<{ code?: string; error?: string }>;
  join: (code: string) => Promise<{ joined?: boolean; error?: string }>;
}

export function useLobby(): UseLobbyReturn {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/room");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setRooms(data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des rooms:", error);
        setError("Impossible de charger les rooms disponibles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const create = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rounds: 5, roundDuration: 30 }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { code: data.code };
    } catch (error) {
      console.error("Erreur lors de la création de la room:", error);
      setError("Erreur lors de la création de la room");
      return { error: "Échec de la création" };
    } finally {
      setIsLoading(false);
    }
  };

  const join = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/room/${code}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { joined: true };
    } catch (error) {
      console.error("Erreur lors de la tentative de rejoindre la room:", error);
      setError("Erreur lors de la tentative de rejoindre la room");
      return { error: "Échec lors de la tentative de rejoindre" };
    } finally {
      setIsLoading(false);
    }
  };

  return { rooms, isLoading, error, create, join };
}