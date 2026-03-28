import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  token: string;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "user",
    }
  )
);
