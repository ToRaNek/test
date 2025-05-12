import create from "zustand";
export const useGameStore = create<any>((set) => ({
  state: null,
  setState: (s: any) => set({ state: s }),
}));