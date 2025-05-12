import create from "zustand";
type LobbyState = { rooms: any[]; setRooms: (rooms: any[]) => void; };
export const useLobbyStore = create<LobbyState>((set) => ({
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
}));