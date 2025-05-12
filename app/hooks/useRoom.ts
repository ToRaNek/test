import { useState, useEffect } from "react";
export function useRoom(roomCode: string) {
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    const poll = setInterval(() => {
      fetch("/api/room?code=" + roomCode)
        .then(r => r.json())
        .then(d => setPlayers(d.players || []));
    }, 3000);
    return () => clearInterval(poll);
  }, [roomCode]);
  return { players };
}