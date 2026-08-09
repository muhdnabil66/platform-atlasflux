"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setTokenProvider } from "@/lib/api-client";

/**
 * Syncs the Clerk session token with the API client.
 * Must be rendered inside ClerkProvider.
 * Gets a fresh token for each API request (never stale).
 */
export function ClerkTokenSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // Register only after Clerk has resolved the session state. This prevents
    // dashboard requests from racing the initial auth bootstrap and sending a
    // request without a Bearer token.
    setTokenProvider(async () => {
      if (!isSignedIn) return null;
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}
