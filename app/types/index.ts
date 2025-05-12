// app/types/index.ts
// Types communs pour le projet

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  pseudo: string | null;
}

export interface Game {
  id: string;
  roomId: string;
  questions: Question[];
  state: GameState;
  scores: Record<string, number>;
  currentQuestionIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  type: 'audio' | 'image';
  question: string;
  previewUrl?: string;
  correct: string;
  choices: string[];
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  status: RoomStatus;
  createdAt: string;
  players: Player[];
}

export interface Player {
  id: string;
  userId: string;
  roomId: string;
  score: number;
  ready: boolean;
  ranking: number | null;
  joinedAt: string;
  user?: User;
}

export interface MusicPreference {
  id: string;
  userId: string;
  selectedPlaylistIds: string[];
  useLikedTracks: boolean;
  useHistory: boolean;
}

export type GameState = 'waiting' | 'running' | 'finished';
export type RoomStatus = 'open' | 'playing' | 'ended';
