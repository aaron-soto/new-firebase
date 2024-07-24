"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import React from "react";
import { auth } from "@/lib/firebase/clientApp";
import { signOut } from "firebase/auth";
import { useAuthStore } from "@/lib/hooks/useAuth";

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <div className="container py-4">
      <div className="z-10 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold">Logo</h1>
        </Link>
        <div className="flex gap-2">
          <Link
            href="/about"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ size: "sm" })}
              >
                Dashboard
              </Link>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  signOut(auth);
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
