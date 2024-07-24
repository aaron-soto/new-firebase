import React, { useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area"; // Ensure you have this component
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/hooks/useAuth";
import { useMessagesStore } from "@/components/Chat/stores/MessagesStore";

const ChatView = ({ chatId }: { chatId: string | null }) => {
  const { messages, fetchMessages } = useMessagesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId, fetchMessages]);

  if (!chatId) {
    return <div>Select a chat to view messages</div>;
  }

  return (
    <ScrollArea className="h-full border-x p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("my-2 w-3/4 bg-neutral-800 py-3 px-4 rounded-2xl", {
            "ml-auto rounded-br-none": message.userId === user?.uid,
            "mr-auto rounded-bl-none": message.userId !== user?.uid,
          })}
        >
          <p className="text-sm font-bold text-neutral-200">You</p>
          <p className="text-sm text-neutral-400">{message.message}</p>
        </div>
      ))}
    </ScrollArea>
  );
};

export default ChatView;
