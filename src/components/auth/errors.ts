import { isClerkAPIResponseError } from "@clerk/react/errors";

export function getErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.message ?? "Something went wrong. Please try again.";
  }
  if (typeof error === "object" && error !== null) {
    const candidate = error as { longMessage?: unknown; message?: unknown };
    if (typeof candidate.longMessage === "string" && candidate.longMessage) {
      return candidate.longMessage;
    }
    if (typeof candidate.message === "string" && candidate.message) {
      return candidate.message;
    }
  }
  return "Something went wrong. Please try again.";
}
