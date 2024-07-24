"use client";

import {
  CHAT_SCREEN,
  useComponentStore,
} from "@/components/Chat/stores/componentStore";

import { Button } from "@/components/ui/button";
import React from "react";
import { Sparkles } from "lucide-react";

const WelcomeScreen = () => {
  const { toggleIsChatWindowOpen, setCurrentScreen } = useComponentStore();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-sm text-center rounded-b-md text-stone-500 bg-neutral-900">
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-1 my-auto">
          <Sparkles
            size={96}
            strokeWidth={7}
            absoluteStrokeWidth
            className="mx-auto text-neutral-800"
          />
          <h2 className="-mb-1 text-2xl font-bold">Welcome to the chat!</h2>
          <p className="mb-4">Here are some helpful links and info</p>
          <div className="flex flex-col p-2 text-left rounded-md bg-neutral-800/50">
            <p>
              For assistance with renting the venue, fill out the{" "}
              <a
                href="/contact"
                className="underline text-wrap text-amber-600 hover:text-amber-700"
              >
                venue reservation form
              </a>
            </p>
          </div>
          <div className="flex flex-col p-2 text-left rounded-md bg-neutral-800/50">
            <p>
              To learn more about our services, visit our{" "}
              <a
                href="/contact"
                className="underline text-wrap text-amber-600 hover:text-amber-700"
              >
                services section
              </a>
            </p>
          </div>
        </div>

        <div className="w-full pt-4 mt-auto border-t">
          <span>Does this answer your question?</span>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={toggleIsChatWindowOpen}
              variant="ghost"
              size="sm"
              className="w-full text-white"
            >
              Yes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-white"
              onClick={() => setCurrentScreen(CHAT_SCREEN.NEW_CHAT)}
            >
              No
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
