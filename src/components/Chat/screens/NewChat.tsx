"use client";

import { MessageSquareText } from "lucide-react";
import React from "react";

const NewChat = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-sm text-center bg-neutral-900">
      <div className="flex flex-col gap-8">
        <MessageSquareText size={116} className="mx-auto text-neutral-800" />
        <p className="text-base font-semibold text-stone-700">
          Send a message to start a new chat
        </p>
      </div>
    </div>
  );
};

export default NewChat;
