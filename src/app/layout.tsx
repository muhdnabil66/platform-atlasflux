import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ClerkTokenSync } from "@/components/providers/clerk-token-sync";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AtlasFlux Developer Platform",
    template: "%s | AtlasFlux Developer Platform",
  },
  description:
    "One API. Intelligent model routing. Access AtlasFlux Nenas Flash through a single OpenAI-compatible API with reasoning, multimodal understanding, web search and automatic model routing.",
  metadataBase: new URL("https://platform.atlasflux.my"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard/overview"
      signUpFallbackRedirectUrl="/dashboard/overview"
      afterSignOutUrl="/"
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-dvh">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkTokenSync />
            <AuthProvider>
              <TooltipProvider delayDuration={300}>
                {children}
                <Toaster richColors position="bottom-right" />
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
