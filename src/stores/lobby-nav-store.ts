import { create } from "zustand";

interface LobbyNavStore {
    selected: string;
    setSelected: (id: string) => void;
}

export const useLobbyNavStore = create<LobbyNavStore>((set) => ({
    selected: "hub",
    setSelected: (id) => set({ selected: id }),
}));