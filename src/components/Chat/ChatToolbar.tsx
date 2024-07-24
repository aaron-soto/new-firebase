import {
  CHAT_SCREEN,
  useComponentStore,
} from "@/components/Chat/stores/componentStore";
import { ChevronLeft, Minus, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const ChatToolbar = () => {
  const { toggleIsChatWindowOpen, currentScreen, setCurrentScreen } =
    useComponentStore();

  const handleCloseChat = () => {
    toggleIsChatWindowOpen();
    setTimeout(() => {
      setCurrentScreen(CHAT_SCREEN.WELCOME);
    }, 200);
  };

  return (
    <div className="flex items-center rounded-t-md bg-[#141414] justify-between border-b p-2">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        {currentScreen !== CHAT_SCREEN.WELCOME && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen(CHAT_SCREEN.WELCOME)}
            className="text-neutral-500 hover:text-orange-500"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <span className={cn(currentScreen === CHAT_SCREEN.WELCOME && "ml-2")}>
          Chat
        </span>{" "}
        <span className="text-orange-500">Support</span>
      </h2>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          className="relative aspect-square text-neutral-500 hover:text-orange-500"
          onClick={() => setCurrentScreen(CHAT_SCREEN.SETTINGS)}
        >
          <Settings size={24} className="absolute" />
        </Button>
        <Button
          variant="ghost"
          className="relative aspect-square text-neutral-500 hover:text-orange-500"
          onClick={toggleIsChatWindowOpen}
        >
          <Minus size={24} className="absolute" />
        </Button>
        <Button
          variant="ghost"
          onClick={handleCloseChat}
          className="relative aspect-square text-neutral-500 hover:text-orange-500"
        >
          <X size={24} className="absolute" />
        </Button>
      </div>
    </div>
  );
};

export default ChatToolbar;
