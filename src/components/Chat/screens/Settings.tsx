import React from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="flex flex-col w-full h-full p-4 text-sm rounded-b-md text-stone-200 bg-neutral-900">
      <h2 className="text-xl font-bold">Settings</h2>
      <Separator className="my-4" />
      <h3 className="font-semibold text-md">Notifications</h3>
      <div className="flex items-center justify-between py-4 text-stone-400">
        <span>Enable notifications</span>
        <Switch />
      </div>
      <div className="flex items-center justify-between py-4 text-stone-400">
        <span>Notification Sounds</span>
        <Switch />
      </div>
    </div>
  );
};

export default Settings;
