import { toast } from "sonner";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error("Error", {
        description: errorMessage,
      });

      console.error("Caught by error handler:", error);
    }
  };
}

export default withErrorHandler;
