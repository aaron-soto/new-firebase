"use client";

import { MessageCircle, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { auth, db } from "@/lib/firebase/clientApp";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import useAuth, { useAuthStore } from "@/lib/hooks/useAuth";

import { AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatWindow from "./ChatWindow";
import { useChatStore } from "@/components/chat/ChatStore";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const {
    setActiveChatId,
    notificationCount,
    setUserId,
    isOpen,
    setIsOpen,
    fetchMessages,
  } = useChatStore();

  const user = useAuth(); // Use the custom hook to get the current user

  const handleOpenChange = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      const collectionRef = collection(db, "chats");

      const q = query(
        collectionRef,
        where("status", "==", "open"),
        where("userId", "==", auth.currentUser?.uid),
        limit(50)
      );

      const chats = await getDocs(q);
      // chats.forEach((chat) => {
      //   console.log(chat.data());
      // });

      if (chats.docs.length > 0) {
        setActiveChatId(chats.docs[0].id);
        fetchMessages(chats.docs[0].id);
      }
    }
  };

  useEffect(() => {
    handleSettingOrGenUID();
  }, [user]);

  const handleSettingOrGenUID = () => {
    if (user) {
      setUserId(user.uid);
      localStorage.removeItem("uid");
    } else {
      const localUid = localStorage.getItem("uid");
      if (localUid) {
        setUserId(localUid);
      } else {
        const newUid = uuidv4();
        localStorage.setItem("uid", newUid);
        setUserId(newUid);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative h-14 w-14 ">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              className="z-[100]  rounded-full absolute w-full h-full hover:scale-110 transition-transform active:scale-95"
              size="icon"
            >
              {isOpen ? (
                <X size={30} strokeWidth={2.25} className="text-amber-600" />
              ) : (
                <MessageCircle
                  size={30}
                  strokeWidth={2.25}
                  className="text-amber-600"
                />
              )}

              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 z-[150]">
                  <Badge className="relative z-[150] w-6 h-6 aspect-square bg-red-600 hover:bg-red-500 rounded-full">
                    <span className="absolute text-sm font-semibold text-center text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      {notificationCount}
                    </span>
                  </Badge>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 mb-2 bg-transparent border-none w-full md:w-[400px] mx-2 md:ml-0 md:mr-4">
            <AnimatePresence>{isOpen && <ChatWindow />}</AnimatePresence>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Chat;
