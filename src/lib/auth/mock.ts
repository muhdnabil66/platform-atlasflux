import type { User } from "@/types/api";

export const IS_CLERK_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
);

export const mockUser: User = {
  id: "usr_2f9k1m",
  name: "Alex Tan",
  email: "alex@atlasflux.my",
  avatarUrl: null,
  clerkId: null,
};

export async function mockSignIn(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockUser;
}

export async function mockSignOut(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
