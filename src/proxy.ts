import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutePatterns = [
  /^\/$/,
  /^\/(?:pricing|models|docs)(?:\/.*)?$/,
  /^\/sign-in(?:\/.*)?$/,
  /^\/sign-up(?:\/.*)?$/,
  /^\/sso-callback(?:\/.*)?$/,
  /^\/api\/webhooks(?:\/.*)?$/,
];

function isPublicRoute(pathname: string) {
  return publicRoutePatterns.some((pattern) => pattern.test(pathname));
}

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request.nextUrl.pathname)) {
    return;
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
