"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatSettings from "./ChatSettings";
import ChatWindowTopBar from "@/components/chat/ChatWindowTopBar";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextInput from "./TextInput";
import { motion } from "framer-motion";
import useAuth from "@/lib/hooks/useAuth"; // Updated import
import { useChatStore } from "@/components/chat/ChatStore";

const ChatWindow = () => {
  const {
    display,
    activeChatId,
    setActiveChatId,
    showHelpfulLinks,
    setShowHelpfulLinks,
    startChat,
    messages,
    userId,
    isOpen,
    setIsOpen,
    fetchMessages,
    fetchChatsForAdmin,
  } = useChatStore();

  const user = useAuth(); // Use the custom hook to get the current user
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [adminChats, setAdminChats] = useState([]);

  const fetchAdminChats = async () => {
    let adminChats = await fetchChatsForAdmin();
    setAdminChats(adminChats);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminChats();
    } else {
      const chatId = localStorage.getItem("activeChatId");
      if (chatId) {
        setActiveChatId(chatId);
        fetchMessages(chatId);
      }
    }
  }, [isOpen, activeChatId, setActiveChatId, fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 200, x: 150, scale: 0.1 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 150, damping: 20 },
      }}
      className="bg-secondary-muted border z-10 rounded-lg w-[400px] flex"
    >
      <div className="flex flex-col w-full h-full">
        <ChatWindowTopBar />
        {display === "chat" && user?.role === "admin" && (
          <div className="flex flex-col h-full max-h-[548px] relative">
            <ScrollArea className="px-3 w-full h-[500px] text-sm">
              <div className="flex relative flex-col gap-2">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    isSelf={
                      message.senderId === user?.uid ||
                      message.senderId === localStorage.getItem("uid")
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <TextInput />
          </div>
        )}
        {display === "chat" && user?.role !== "admin" && (
          <>
            <div className="flex flex-col h-full max-h-[548px] relative">
              {activeChatId && !showHelpfulLinks && messages.length > 0 && (
                <ScrollArea className="px-3 w-full h-[500px] text-sm">
                  <div className="flex relative flex-col gap-2">
                    {adminChats.map((message: any, index: number) => {
                      console.log(message);
                      return (
                        <div key={index}>
                          <p>{message.senderId}</p>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}

              {activeChatId && !showHelpfulLinks && messages.length === 0 && (
                <div className="flex flex-col gap-4 p-4 text-sm justify-center items-center h-[500px] w-full">
                  <MessageSquareText
                    size={85}
                    strokeWidth={2.25}
                    className="text-stone-800"
                  />
                  <p className="text-stone-400 text-center">
                    We will get in touch with you as soon as possible within 9AM
                    to 5PM MST on weekdays.
                  </p>
                </div>
              )}

              {!activeChatId && !showHelpfulLinks && (
                <div className="flex flex-col items-center justify-center flex-1 gap-8 p-4 text-sm text-center text-gray-400">
                  <MessageSquareText
                    size={85}
                    strokeWidth={2.25}
                    className="text-stone-800"
                  />
                  <p>
                    Have a question? We&apos;re here to help. Start a chat with
                    us now or send us an email at{" "}
                    <Link
                      href="mailto:email@example.com"
                      className="underline text-amber-600 hover:text-amber-700"
                    >
                      email@example.com
                    </Link>
                  </p>
                  <div className="flex w-full p-4 mt-auto">
                    <Button
                      variant="secondary"
                      className="w-full bg-amber-600 hover:bg-amber-500"
                      onClick={() => {
                        setShowHelpfulLinks(true);
                      }}
                    >
                      Start a chat
                    </Button>
                  </div>
                </div>
              )}

              {!activeChatId && showHelpfulLinks && (
                <div className="flex flex-col items-center justify-center flex-1 gap-8 p-4 text-sm text-center text-gray-400">
                  <div className="flex flex-col gap-2">
                    <span>Here are some helpful links and info</span>
                    <div className="flex flex-col text-left bg-stone-900/30 p-2 rounded-md">
                      <p>
                        For assistance with renting the venue, fill out the{" "}
                        <Link
                          href="/contact"
                          className="underline inline-flex text-amber-600 hover:text-amber-700"
                        >
                          Venue Reservation Form
                        </Link>
                      </p>
                    </div>
                    <div className="flex flex-col text-left bg-stone-900/30 p-2 rounded-md">
                      <p>
                        To learn more about our services, visit our{" "}
                        <Link
                          href="/contact"
                          className="underline inline-flex text-amber-600 hover:text-amber-700"
                        >
                          Services Section
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto w-full">
                    <span>Does this answer your question?</span>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 w-full"
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => {
                            setShowHelpfulLinks(false);
                          }, 500);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 w-full"
                        onClick={async () => {
                          setShowHelpfulLinks(false);
                          const chatId = await startChat(userId!);
                          localStorage.setItem("activeChatId", chatId);
                        }}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {activeChatId && <TextInput />}
            </div>
          </>
        )}
        {display === "settings" && <ChatSettings />}
      </div>
    </motion.div>
  );
};

export default ChatWindow;
