import { create } from "zustand";
import { AppUser } from "../lib/definitions";

type UserStore = {
  user: AppUser | null,
  setUser: (user: AppUser | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))