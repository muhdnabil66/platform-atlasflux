import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthOnlyForm } from "@/components/auth/oauth-only-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your AtlasFlux developer account.",
};

export default function SignUpPage() {
  return (
    <AuthShell>
      <OAuthOnlyForm mode="sign-up" />
    </AuthShell>
  );
}
