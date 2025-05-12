// app/store/useLobbyStore.ts
import { create } from 'zustand';
import { Room } from '../types';

type LobbyState = {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
};

export const useLobbyStore = create<LobbyState>((set) => ({
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
}));
