import { NextResponse } from "next/server";

interface ErrorResponsePayload {
  error: string;
  details?: Record<string, unknown>;
}

/**
 * Creates a standardized JSON success response.
 *
 * @param data - Payload to include in the response body.
 * @param init - Optional response init overrides such as status code.
 * @returns Next.js JSON response with provided data.
 */
export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    init,
  );
}

/**
 * Creates a standardized JSON error response.
 *
 * @param message - Human readable error message.
 * @param status - HTTP status code to return, defaults to 400.
 * @param details - Optional structured details for the error.
 * @returns Next.js JSON response containing the error payload.
 */
export function jsonError(message: string, status = 400, details?: Record<string, unknown>) {
  const body: ErrorResponsePayload = {
    error: message,
  };
  if (details) {
    body.details = details;
  }
  return NextResponse.json(
    {
      success: false,
      ...body,
    },
    { status },
  );
}

