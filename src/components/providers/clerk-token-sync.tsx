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
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token provider so apiRequest() gets fresh tokens
    setTokenProvider(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });

    return () => {
      setTokenProvider(() => Promise.resolve(null));
    };
  }, [getToken]);

  return null;
}
