import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { create } from "zustand";
import { db } from "@/lib/firebase/clientApp";
import { v4 as uuidV4 } from "uuid";

interface Chat {
  chatId: string;
  createdAt: string;
  status: "open" | "closed";
  userId: string;
}

export interface Message {
  chatId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

interface ChatStore {
  isOpen: boolean;
  userId: string | null;
  setUserId: (userId: string) => void;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  activeChatId: string | null;
  display: "chat" | "settings";
  showHelpfulLinks: boolean;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  clearNotificationCount: () => void;
  setShowHelpfulLinks: (show: boolean) => void;
  addMessage: (message: Message) => void;
  changeDisplay: (display: "chat" | "settings") => void;
  setActiveChatId: (chatId: string | null) => void;
  startChat: (userId: string) => Promise<string>;
  fetchMessages: (chatId: string) => void;
  fetchChatsForAdmin: () => any;
}

export const useChatStore = create<ChatStore>((set) => {
  return {
    isOpen: false,
    userId: null,
    setUserId: (userId) => set({ userId }),
    setIsOpen: (open) => set({ isOpen: open }),
    messages: [],
    activeChatId: null,
    display: "chat",
    showHelpfulLinks: false,
    notificationCount: 0,
    fetchChatsForAdmin: async () => {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("status", "==", "open"));

      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          chatId: data.chatId,
          createdAt: data.createdAt,
          status: data.status,
          userId: data.userId,
        };
      });
      return chats;
    },
    clearNotificationCount: () => set({ notificationCount: 0 }),
    setNotificationCount: (count) => set({ notificationCount: count }),
    setShowHelpfulLinks: (show) => set({ showHelpfulLinks: show }),
    addMessage: async (message) => {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("chatId", "==", message.chatId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If the chat does not exist, create a new one
        const chat = {
          chatId: message.chatId,
          createdAt: new Date().toISOString(),
          status: "open",
          userId: message.senderId,
        };
        await setDoc(doc(db, "chats", message.chatId), chat);
      }

      const messagesCollectionRef = collection(
        db,
        `chats/${message.chatId}/messages`
      );

      await addDoc(messagesCollectionRef, {
        chatId: message.chatId,
        message: message.message,
        senderId: message.senderId,
        timestamp: message.timestamp,
      });

      // Update the chat document with the last message details
      await setDoc(
        doc(db, "chats", message.chatId),
        {
          lastMessage: message.message,
          lastMessageTimestamp: message.timestamp,
        },
        { merge: true }
      );
    },

    fetchMessages: (chatId) => {
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            chatId,
            senderId: data.senderId,
            message: data.message,
            timestamp:
              data.timestamp instanceof Date
                ? data.timestamp
                : data.timestamp.toDate
                ? data.timestamp.toDate()
                : new Date(data.timestamp),
          };
        }) as Message[];
        set({ messages });
      });
    },

    changeDisplay: (display) => set({ display }),
    setActiveChatId: (chatId: string | null) => {
      set({ activeChatId: chatId });
    },
    startChat: async (userId: string) => {
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("userId", "==", userId),
        where("status", "==", "open")
      );

      const querySnapshot = await getDocs(q);
      let chatId;

      if (!querySnapshot.empty) {
        // If there is an existing open chat, use it
        const chatDoc = querySnapshot.docs[0];
        chatId = chatDoc.id;
      } else {
        // If no open chat, create a new one
        chatId = uuidV4();
        const chat: Chat = {
          chatId,
          createdAt: new Date().toISOString(),
          status: "open",
          userId,
        };

        await setDoc(doc(db, "chats", chatId), chat);
      }

      localStorage.setItem("activeChatId", chatId);
      set({ activeChatId: chatId });

      return chatId;
    },
  };
});
