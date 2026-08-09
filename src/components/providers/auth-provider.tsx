"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import type { User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  isClerkConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();

  const user = useMemo<User | null>(() => {
    if (!clerkUser) return null;
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username || "User",
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      avatarUrl: clerkUser.imageUrl,
      clerkId: clerkUser.id,
    };
  }, [clerkUser]);

  const signIn = useCallback(async () => {
    await clerk.redirectToSignIn({ redirectUrl: "/dashboard/overview" });
  }, [clerk]);

  const signOut = useCallback(async () => {
    await clerk.signOut();
  }, [clerk]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isClerkConfigured: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
      isLoaded,
      isSignedIn: isSignedIn ?? false,
      signIn,
      signOut,
    }),
    [user, isLoaded, isSignedIn, signIn, signOut]
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
