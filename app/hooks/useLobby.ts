import { useState, useEffect } from "react";
export function useLobby() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { fetch("/api/room").then(r => r.json()).then(setRooms); }, []);
  const create = async () => { /* ... */ };
  const join = async (code: string) => { /* ... */ };
  return { rooms, create, join };
}