import { toast } from "sonner";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Something went wrong.";

      toast.error("Error", {
        description: errorMessage,
      });

      console.error("Caught by error handler:", error);
    }
  };
}

export default withErrorHandler;
