import { Button } from "@/components/ui/button";
import React from "react";

const CloseConfirmation = ({
  handleConfirmClose,
  handleCancelClose,
}: {
  handleConfirmClose: () => void;
  handleCancelClose: () => void;
}) => {
  return (
    <div className="absolute inset-0 flex items-center rounded-lg justify-center bg-black/45 backdrop-blur-md bg-opacity-50">
      <div className="p-4 text-sm text-black bg-white rounded-lg">
        <p>Are you sure you want to close the chat?</p>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" onClick={handleCancelClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="ml-2"
            onClick={handleConfirmClose}
          >
            Close Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CloseConfirmation;
