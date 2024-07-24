"use client";

import { useState } from "react";

const CustomCheckbox = ({ label }: { label: string }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="flex items-center justify-between w-full gap-4">
        <p className="text-black">Enable notifications for chat</p>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className={`w-5 h-5 transition duration-150 ease-in-out form-checkbox border-gray-300 rounded ${
            checked
              ? "text-indigo-600 border-indigo-600"
              : "text-gray-600 border-gray-300"
          } focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        />
      </label>
    </div>
  );
};

export default CustomCheckbox;
