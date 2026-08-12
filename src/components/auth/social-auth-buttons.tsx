"use client";

import { useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { LoaderCircle } from "lucide-react";
import { getErrorMessage } from "@/components/auth/errors";

type OAuthStrategy = "oauth_google" | "oauth_github";
type BrandIcon = (props: SVGProps<SVGSVGElement>) => ReactNode;

interface SocialAuthButtonsProps {
  isLoaded: boolean;
  onAuthenticate: (strategy: OAuthStrategy) => Promise<void>;
  onError: (message: string | null) => void;
}

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.59 0 4.76-.86 6.34-2.33l-3.14-2.45c-.87.58-1.98.92-3.2.92-2.46 0-4.55-1.66-5.3-3.9H3.45v2.53A9.58 9.58 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.7 13.74a5.76 5.76 0 0 1 0-3.48V7.73H3.45a9.6 9.6 0 0 0 0 8.54l3.25-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.36c1.41 0 2.68.49 3.68 1.45l2.76-2.76C16.76 3.5 14.59 2.5 12 2.5a9.58 9.58 0 0 0-8.55 5.23L6.7 10.26c.75-2.24 2.84-3.9 5.3-3.9Z"
      />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58 0-.28-.01-1.04-.01-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.69.83.57A12 12 0 0 0 24 12.3C24 5.67 18.63.3 12 .3Z" />
    </svg>
  );
}

const PROVIDERS: Array<{ strategy: OAuthStrategy; label: string; icon: BrandIcon }> = [
  { strategy: "oauth_google", label: "Google", icon: GoogleIcon },
  { strategy: "oauth_github", label: "GitHub", icon: GitHubIcon },
];

export function SocialAuthButtons({
  isLoaded,
  onAuthenticate,
  onError,
}: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<OAuthStrategy | null>(null);

  async function handleAuthenticate(strategy: OAuthStrategy) {
    setLoading(strategy);
    onError(null);
    try {
      await onAuthenticate(strategy);
    } catch (error) {
      onError(getErrorMessage(error));
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.strategy}
            type="button"
            disabled={!isLoaded || loading !== null}
            onClick={() => void handleAuthenticate(provider.strategy)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === provider.strategy ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <provider.icon className="size-5" />
            )}
            Continue with {provider.label}
          </button>
        ))}
      </div>

    </>
  );
}
