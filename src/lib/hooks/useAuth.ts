import { User, onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase/clientApp";
import { create } from "zustand";
import { useEffect } from "react";

interface AZUser extends User {
  role?: "admin" | "user";
}

interface AuthStore {
  user: AZUser | null;
  setUser: (user: AZUser | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Custom hook to initialize and listen for auth changes
export const useAuthListener = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as AZUser);
        console.log(firebaseUser as AZUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
};
