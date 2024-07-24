import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { create } from "zustand";
import { db } from "@/lib/firebase/clientApp";

interface Chat {
  id: string;
  createdAt: Date;
  status: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  userId: string;
  adminId: string;
  messages: string[];
  closeAt: Date;
}

interface ChatStore {
  chats: Chat[];
  activeChat: Chat | null;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat) => void;
  clearActiveChat: () => void;
  fetchChats: (userId: string) => void;
  restoreActiveChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChat: null,
  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  clearActiveChat: () => set({ activeChat: null }),
  fetchChats: async (userId: string) => {
    try {
      const chatRef = collection(db, "chats");
      const q = query(
        chatRef,
        where("userId", "==", userId),
        where("status", "==", "open")
      );
      const chatSnapshot = await getDocs(q);
      const chats = chatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      set({ chats });
    } catch (error) {
      console.error("Error fetching chats: ", error);
    }
  },
  restoreActiveChat: async () => {
    const activeChatId = localStorage.getItem("activeChatId");
    if (activeChatId) {
      const chatRef = doc(db, "chats", activeChatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        const chat = { id: activeChatId, ...chatDoc.data() } as Chat;
        set({ activeChat: chat });
      }
    }
  },
}));
