"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/api";
import { IS_CLERK_CONFIGURED, mockSignIn, mockSignOut, mockUser } from "@/lib/auth/mock";

interface AuthContextValue {
  user: User | null;
  isClerkConfigured: boolean;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("atlasflux-auth-user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const signIn = useCallback(async () => {
    const signedInUser = await mockSignIn();
    localStorage.setItem("atlasflux-auth-user", JSON.stringify(signedInUser));
    setUser(signedInUser);
    return signedInUser;
  }, []);

  const signOut = useCallback(async () => {
    await mockSignOut();
    localStorage.removeItem("atlasflux-auth-user");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? mockUser,
      isClerkConfigured: IS_CLERK_CONFIGURED,
      signIn,
      signOut,
    }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
