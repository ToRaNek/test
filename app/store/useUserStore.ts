import create from "zustand";

type User = {
  id: string;
  pseudo: string;
  avatar?: string;
};

type UserStore = {
  user?: User;
  setUser(u: User): void;
  clear(): void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: undefined }),
}));