"use client";

import {
  CHAT_SCREEN,
  useComponentStore,
} from "@/components/Chat/stores/componentStore";

import ChatView from "@/components/Chat/screens/ChatView";
import NewChat from "@/components/Chat/screens/NewChat";
import React from "react";
import Settings from "@/components/Chat/screens/Settings";
import Welcome from "@/components/Chat/screens/Welcome";
import { useChatStore } from "@/components/Chat/stores/ChatStore"; // Adjust the import path as needed

const ChatScreen = () => {
  const { currentScreen } = useComponentStore();
  const { activeChat } = useChatStore();
  const activeChatId = activeChat?.id;

  switch (currentScreen) {
    case CHAT_SCREEN.WELCOME:
      return <Welcome />;
    case CHAT_SCREEN.SETTINGS:
      return <Settings />;
    case CHAT_SCREEN.NEW_CHAT:
      return <NewChat />;
    case CHAT_SCREEN.CHAT_VIEW:
      return <ChatView chatId={activeChatId!} />; // Use the active chat ID
    default:
      return <Welcome />;
  }
};

export default ChatScreen;
