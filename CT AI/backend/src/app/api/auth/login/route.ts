import { NextRequest } from "next/server";

import { loginUser } from "@/services/authService";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

/**
 * Authenticates users and issues JWT tokens.
 *
 * @param request - Incoming request containing login credentials.
 * @returns JSON payload with user data and tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const result = await loginUser(payload);
    return jsonSuccess({
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return jsonError(message, 401);
  }
}

