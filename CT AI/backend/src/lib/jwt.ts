import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";
import type { UserRole } from "@/types/user";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
  type: "access";
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
  type: "refresh";
}

/**
 * Signs a JWT access token for the given user.
 *
 * @param userId - MongoDB identifier of the user.
 * @param role - Role assigned to the user, e.g. admin/editor/user.
 * @returns Signed JWT access token string.
 */
export function signAccessToken(userId: string, role: UserRole): string {
  const payload: AccessTokenPayload = {
    sub: userId,
    role,
    type: "access",
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/**
 * Signs a JWT refresh token for the given user.
 *
 * @param userId - MongoDB identifier of the user.
 * @param role - Role assigned to the user.
 * @returns Signed JWT refresh token string.
 */
export function signRefreshToken(userId: string, role: UserRole): string {
  const payload: RefreshTokenPayload = {
    sub: userId,
    role,
    type: "refresh",
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verifies an access token and returns its payload.
 *
 * @param token - JWT access token string to verify.
 * @returns Decoded access token payload if validation succeeds.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

/**
 * Verifies a refresh token and returns its payload.
 *
 * @param token - JWT refresh token string to verify.
 * @returns Decoded refresh token payload if validation succeeds.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

