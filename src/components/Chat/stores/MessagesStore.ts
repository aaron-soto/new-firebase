import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { create } from "zustand";
import { db } from "@/lib/firebase/clientApp";

interface Message {
  id: string;
  chatId: string;
  userId: string;
  timestamp: Date;
  message: string;
}

interface MessagesStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  fetchMessages: (chatId: string) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],
  addMessage: async (message) => {
    try {
      // Check if the chat exists
      const chatRef = doc(db, "chats", message.chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // If the chat does not exist, create a new one
        const newChat = {
          chatId: message.chatId,
          createdAt: new Date(),
          status: "open",
          userId: message.userId,
        };
        await setDoc(chatRef, newChat);
      }

      const messagesCollectionRef = collection(
        db,
        `chats/${message.chatId}/messages`
      );
      await addDoc(messagesCollectionRef, {
        chatId: message.chatId,
        message: message.message,
        userId: message.userId,
        timestamp: message.timestamp,
      });

      // Update the chat document with the last message details
      await setDoc(
        chatRef,
        {
          lastMessage: message.message,
          lastMessageTimestamp: message.timestamp,
        },
        { merge: true }
      );

      // Update the local state
      set((state) => ({ messages: [...state.messages, message] }));
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  },
  clearMessages: () => set({ messages: [] }),
  fetchMessages: async (chatId) => {
    try {
      const chatRef = collection(db, "chats", chatId, "messages");
      const q = query(chatRef, orderBy("timestamp", "asc"));
      const messageSnapshot = await getDocs(q);
      const messages = messageSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      set({ messages });
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  },
}));
