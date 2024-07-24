"use client";

import React, { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthListener, useAuthStore } from "@/lib/hooks/useAuth";

import SignInComponent from "@/app/signin/page";
import { db } from "@/lib/firebase/clientApp";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthListener();
  const { user } = useAuthStore();

  useEffect(() => {
    const updateUserDoc = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const metaData = user.metadata;

        try {
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(
              userRef,
              {
                uid: user.uid,
                lastSeen: new Date(),
                email: user.email,
                metadata: {
                  creationTime: metaData.creationTime,
                  lastSignInTime: metaData.lastSignInTime,
                },
                role: "user",
              },
              { merge: true }
            );
          } else {
            await setDoc(
              userRef,
              {
                lastSeen: new Date(),
                metadata: {
                  creationTime: metaData.creationTime,
                  lastSignInTime: metaData.lastSignInTime,
                },
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.error("Error updating user document:", error);
        }
      }
    };

    updateUserDoc();
  }, [user]);

  if (!user) {
    return <SignInComponent />;
  }

  return <>{children}</>;
};

export default DashboardLayout;
