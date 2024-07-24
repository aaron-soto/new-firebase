"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Message, useChatStore } from "@/components/chat/ChatStore";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/clientApp";

import { Button } from "@/components/ui/button";
import React from "react";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  message: z.string().nonempty("Message cannot be empty"),
});

const TextInput = () => {
  const { activeChatId, userId, addMessage } = useChatStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { message } = values;

    if (!userId || !activeChatId) return;

    const newMessage: Message = {
      chatId: activeChatId!,
      senderId: userId,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting message:", newMessage);

    // Add message to local state first
    addMessage(newMessage);

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
    <div className="w-full bg-[#141414] rounded-b-md flex gap-2 items-center p-2">
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
                    className="rounded-md w-full h-10 max-h-24 resize-none overflow-y-auto"
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
