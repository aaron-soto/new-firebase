"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const CustomSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4 bg-white">
      <Switch
        checked={enabled}
        onChange={() => setEnabled((enabled) => !enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-black" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </Switch>
    </div>
  );
};

export default CustomSwitch;
