"use client";

import { ChevronLeft, Minus, Settings, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import CloseConfirmation from "@/components/chat/CloseConfirmation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useChatStore } from "@/components/chat/ChatStore";

const ChatWindowTopBar = () => {
  const { display, activeChatId, setActiveChatId, setIsOpen, changeDisplay } =
    useChatStore();
  const [confirmClose, setConfirmClose] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    // Check if current time is between 9am and 5pm MST
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
      setIsBusinessHours(true);
    } else {
      setIsBusinessHours(false);
    }
  }, []);

  const handleCloseClick = () => {
    if (activeChatId) {
      setConfirmClose(true);
    } else {
      setIsOpen(false);
      changeDisplay("chat");
    }
  };

  const handleConfirmClose = () => {
    setConfirmClose(false);
    changeDisplay("chat");
    setIsOpen(false);
    setActiveChatId(null);
  };

  const handleCancelClose = () => {
    setConfirmClose(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 border-b border-stone-700">
        {display === "settings" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeDisplay("chat")}
          >
            <ChevronLeft />
          </Button>
        )}
        <motion.h1
          className="pl-2 mr-auto text-lg font-bold items-center flex gap-1 text-white"
          initial={{ x: 0 }}
          animate={{ x: display === "settings" ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          Chat <span className="text-amber-600">Support</span>
          <div
            className={cn(
              "h-2.5 ml-2 w-2.5 rounded-full inline-block relative ",
              isBusinessHours
                ? "bg-green-500 before:animate-ping before:absolute before:inset-0 before:bg-green-500 before:rounded-full before:h-2.5 before:w-2.5"
                : "bg-stone-600"
            )}
          ></div>
        </motion.h1>
        <div className="flex">
          <Button
            className="text-white transition-colors "
            size="icon"
            variant="ghost"
            onClick={() =>
              changeDisplay(display === "chat" ? "settings" : "chat")
            }
          >
            <Settings size={20} strokeWidth={2.25} />
          </Button>
          <Button
            className="text-white transition-colors "
            size="icon"
            variant="ghost"
            onClick={() => {
              changeDisplay("chat");
              setIsOpen(false);
            }}
          >
            <Minus size={20} strokeWidth={2.25} />
          </Button>
          <Button
            className="text-white transition-colors "
            size="icon"
            variant="ghost"
            onClick={handleCloseClick}
          >
            <X size={20} strokeWidth={2.25} />
          </Button>
        </div>
      </div>
      {confirmClose && (
        <CloseConfirmation
          handleConfirmClose={handleConfirmClose}
          handleCancelClose={handleCancelClose}
        />
      )}
    </>
  );
};

export default ChatWindowTopBar;
