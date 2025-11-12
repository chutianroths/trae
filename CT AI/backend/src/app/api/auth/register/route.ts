import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/utils/apiResponse";
import { registerUser } from "@/services/authService";

/**
 * Handles user registration requests.
 *
 * @param request - Incoming Next.js request object containing body payload.
 * @returns JSON response with user profile and authentication tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const result = await registerUser(payload);
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
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return jsonError(message, 400);
  }
}

