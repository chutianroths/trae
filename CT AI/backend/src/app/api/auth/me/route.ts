import { NextRequest } from "next/server";

import { getUserProfile } from "@/services/authService";
import { verifyAccessToken } from "@/lib/jwt";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

/**
 * Returns the profile of the currently authenticated user.
 *
 * @param request - HTTP request containing the Authorization header.
 * @returns JSON response with user profile fields.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonError("Authorization header missing", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    const user = await getUserProfile(payload.sub);

    return jsonSuccess({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return jsonError(message, 401);
  }
}

