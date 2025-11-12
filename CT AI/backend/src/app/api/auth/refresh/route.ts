import { NextRequest } from "next/server";

import { refreshAuthTokens } from "@/services/authService";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

/**
 * Exchanges a refresh token for a new access token pair.
 *
 * @param request - Request object containing refresh token in the body.
 * @returns JSON response with renewed tokens and user profile.
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    const result = await refreshAuthTokens(refreshToken);
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
    const message = error instanceof Error ? error.message : "Token refresh failed";
    return jsonError(message, 401);
  }
}

