// app/store/useGameStore.ts
import { create } from "zustand";

interface GameState {
  state: GameStateType | null;
  setState: (state: GameStateType) => void;
}

interface GameStateType {
  id: string;
  roomId: string;
  questions: QuestionType[];
  state: "waiting" | "running" | "finished";
  scores: Record<string, number>;
  currentQuestionIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface QuestionType {
  type: "audio" | "image";
  question: string;
  previewUrl?: string;
  correct: string;
  choices: string[];
}

export const useGameStore = create<GameState>((set) => ({
  state: null,
  setState: (s) => set({ state: s }),
}));