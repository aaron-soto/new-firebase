import { create } from "zustand";

export enum CHAT_SCREEN {
  WELCOME = "welcome",
  SETTINGS = "settings",
  NEW_CHAT = "new_chat",
  CHAT_VIEW = "chat_view",
}

interface ComponentStore {
  isChatWindowOpen: boolean;
  currentScreen: CHAT_SCREEN;
  setIsChatWindowOpen: (open: boolean) => void;
  setCurrentScreen: (screen: CHAT_SCREEN) => void;
  toggleIsChatWindowOpen: () => void;
}

export const useComponentStore = create<ComponentStore>((set) => ({
  isChatWindowOpen: false,
  currentScreen: CHAT_SCREEN.WELCOME, // default screen
  setIsChatWindowOpen: (open: boolean) => set({ isChatWindowOpen: open }),
  setCurrentScreen: (screen: CHAT_SCREEN) => set({ currentScreen: screen }),
  toggleIsChatWindowOpen: () =>
    set((state) => ({ isChatWindowOpen: !state.isChatWindowOpen })),
}));
