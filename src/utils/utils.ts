import { ApiError } from "@/types/ApiError";

class Utils {
  static handleApiError(error: unknown): ApiError {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    return this.buildApiError("Internal Server Error", message, 500);
  }

  static buildApiError(
    _error: string,
    message: string,
    status: number
  ): ApiError {
    return {
      _error: _error,
      message: message,
      statusCode: status,
    };
  }
}

export default Utils;
