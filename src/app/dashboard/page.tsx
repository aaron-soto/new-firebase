"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import React from "react";
import { auth } from "@/lib/firebase/clientApp";
import { signOut } from "firebase/auth";
import { useAuthStore } from "@/lib/hooks/useAuth";

const DashboardPage = () => {
  const { setUser } = useAuthStore();
  return (
    <div className="container py-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Home
          </Link>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              signOut(auth);
              setUser(null);
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
