"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import SimpleIcon from "@/components/SimpleIcon";

const SocialSignUps = () => {
  return (
    <div className="flex gap-2 my-4">
      <Button variant="outline" className="w-full">
        <SimpleIcon name="apple" size={19} />
      </Button>
      <Button variant="outline" className="w-full">
        <SimpleIcon name="google" color="#fcba03" size={19} />
      </Button>
      <Button variant="outline" className="w-full">
        <SimpleIcon name="facebook" color="#3b5998" size={19} />
      </Button>
    </div>
  );
};

export default SocialSignUps;
