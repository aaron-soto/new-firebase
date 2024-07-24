import {
  CHAT_SCREEN,
  useComponentStore,
} from "@/components/Chat/stores/componentStore";
import React, { useEffect, useState } from "react";

import ChatScreen from "@/components/Chat/ChatScreen";
import ChatToolbar from "@/components/Chat/ChatToolbar";
import TextInput from "@/components/Chat/TextInput";
import { useChatStore } from "@/components/Chat/stores/ChatStore";

const ChatWindow = () => {
  const { setCurrentScreen, currentScreen } = useComponentStore();
  const { activeChat, restoreActiveChat } = useChatStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkActiveChat = async () => {
      restoreActiveChat();
      if (isInitialLoad && activeChat) {
        setCurrentScreen(CHAT_SCREEN.CHAT_VIEW);
      }
      setIsInitialLoad(false);
    };
    checkActiveChat();
  }, [isInitialLoad, activeChat, restoreActiveChat, setCurrentScreen]);

  return (
    <div className="flex absolute right-0 bottom-0 flex-col w-[450px] rounded-md h-[550px] bg-transparent">
      <ChatToolbar />
      <div className="flex-1">
        <ChatScreen />
      </div>
      {currentScreen === CHAT_SCREEN.CHAT_VIEW ||
        (currentScreen === CHAT_SCREEN.NEW_CHAT && <TextInput />)}
    </div>
  );
};

export default ChatWindow;
