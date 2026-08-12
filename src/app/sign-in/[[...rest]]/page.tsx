import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthOnlyForm } from "@/components/auth/oauth-only-form";
import { SsoErrorNotice } from "@/components/auth/sso-error-notice";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AtlasFlux developer account.",
};

export default function SignInPage() {
  return (
    <AuthShell>
      <div className="mb-6">
        <Suspense fallback={null}>
          <SsoErrorNotice />
        </Suspense>
      </div>
      <OAuthOnlyForm mode="sign-in" />
    </AuthShell>
  );
}
