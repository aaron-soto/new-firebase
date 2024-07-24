import { cn, formatChatTimestamp } from "@/lib/utils";

import { Message } from "@/components/chat/ChatStore";
import React from "react";
import { auth } from "@/lib/firebase/clientApp";

const ChatMessage = ({
  message,
  isSelf,
}: {
  message: Message;
  isSelf: boolean;
}) => {
  const formattedTimestamp = formatChatTimestamp(new Date(message.timestamp));

  if (message.senderId === "system") {
    return (
      <div className="flex justify-center w-full">
        <span className="text-xs font-semibold text-gray-400/40 bg-stone-900/40 px-2 py-1 rounded-md">
          {message.message} {isSelf ? "by you" : ""} at {formattedTimestamp}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-[320px] leading-1.5 py-2 px-4 border-gray-200",
        {
          "bg-white self-end text-black rounded-s-xl rounded-se-xl": isSelf,
          "bg-neutral-600 self-start rounded-e-xl rounded-es-xl": !isSelf,
        }
      )}
    >
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-sm font-bold">
          {message.senderId === auth.currentUser?.uid ? "You" : "Support"}
        </span>
        <span className="text-xs font-normal">{formattedTimestamp}</span>
      </div>
      <p className="text-sm font-normal pt-1">{message.message}</p>
    </div>
  );
};

export default ChatMessage;
