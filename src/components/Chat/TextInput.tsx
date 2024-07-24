"use client";

import {
  CHAT_SCREEN,
  useComponentStore,
} from "@/components/Chat/stores/componentStore";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/hooks/useAuth";
import { useChatStore } from "@/components/Chat/stores/ChatStore"; // Adjust the import path as needed
import { useForm } from "react-hook-form";
import { useMessagesStore } from "@/components/Chat/stores/MessagesStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  message: z.string().nonempty("Message cannot be empty"),
});

const TextInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const addMessage = useMessagesStore((state) => state.addMessage);
  const { activeChat, setActiveChat, restoreActiveChat } = useChatStore();
  const { user } = useAuthStore();
  const { setCurrentScreen } = useComponentStore();

  useEffect(() => {
    restoreActiveChat();
  }, [restoreActiveChat]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { message } = values;

    let chatId = activeChat?.id;
    if (!chatId) {
      // If there's no active chat, create a new one
      chatId = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the chat
      const newChat = {
        id: chatId,
        createdAt: new Date(),
        status: "open",
        userId: user?.uid,
        adminId: null, // Adjust if needed
        messages: [],
        closeAt: null,
      };
      setActiveChat(newChat as any);
      localStorage.setItem("activeChatId", chatId);
    }

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for the message
      chatId,
      userId: user?.uid,
      timestamp: new Date(),
      message,
    };

    addMessage(newMessage as any);
    setCurrentScreen(CHAT_SCREEN.CHAT_VIEW);

    // Reset form
    form.reset();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full bg-[#141414] rounded-b-md border-t flex gap-2 items-center p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full gap-1"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Textarea
                    placeholder="Type your message..."
                    className="w-full h-10 overflow-y-auto rounded-md resize-none max-h-24"
                    style={{
                      height: "2.5rem",
                      minHeight: "2.5rem",
                      maxHeight: "6rem",
                      lineHeight: "1.5",
                      padding: ".5rem",
                    }}
                    onKeyDown={handleKeyDown}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <Button variant="outline" className="h-10" type="submit">
            <SendHorizonal size={20} strokeWidth={2.25} className="" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TextInput;
