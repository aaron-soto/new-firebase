"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/Chat/ChatWindow";
import { MessageCircle } from "lucide-react";
import React from "react";
import { useComponentStore } from "@/components/Chat/stores/componentStore";

const Chat = () => {
  const { isChatWindowOpen, toggleIsChatWindowOpen } = useComponentStore();

  return (
    <div className="fixed bottom-4 right-4 w-[59px] h-[59px]">
      <Popover open={isChatWindowOpen} onOpenChange={toggleIsChatWindowOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button className="rounded-full bg-orange-500 hover:bg-orange-400 h-[59px] w-[59px] hover:scale-[1.08] active:scale-95 transition-all duration-200">
              <MessageCircle
                size={29}
                strokeWidth={2.7}
                absoluteStrokeWidth
                className="absolute text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" side="top" sideOffset={16}>
          <ChatWindow />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Chat;
