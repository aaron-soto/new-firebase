import React from "react";
import { Switch } from "@/components/ui/switch";

const ChatSettings = () => {
  return (
    <div className="flex flex-col  w-full h-[500px] p-4 text-sm text-center text-gray-400 divide-y divide-gray-200/10">
      <div className="flex justify-between w-full py-4 space-x-4">
        <span>Notifications</span>
        <Switch />
      </div>
      <div className="flex justify-between w-full py-4 space-x-4">
        <span>Silent Notifications</span>
        <Switch />
      </div>
    </div>
  );
};

export default ChatSettings;
