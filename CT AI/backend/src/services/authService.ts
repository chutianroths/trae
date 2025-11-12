import { z } from "zod";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createUser,
  findUserByEmail,
  findUserById,
  touchUser,
} from "@/repositories/userRepository";
import type { User, UserRole } from "@/types/user";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult extends AuthTokens {
  user: AuthUser;
}

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "editor", "user"]).default("user"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Generates both access and refresh tokens for a given user.
 *
 * @param user - User document used to extract identifier and role.
 * @returns Object containing signed access and refresh tokens.
 */
function generateTokens(user: User): AuthTokens {
  const userId = user._id;
  return {
    accessToken: signAccessToken(userId, user.role),
    refreshToken: signRefreshToken(userId, user.role),
  };
}

/**
 * Maps a database user into a safe DTO for API responses.
 *
 * @param user - User document from the database.
 * @returns Plain object without sensitive fields such as password hash.
 */
function toUserResponse(user: User): AuthUser {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Registers a new user and returns authentication tokens.
 *
 * @param payload - User registration payload containing name, email, password and optional role.
 * @returns Authentication result including user profile and tokens.
 */
export async function registerUser(payload: unknown): Promise<AuthResult> {
  const data = registerSchema.parse(payload);

  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role as UserRole,
  });

  const tokens = generateTokens(user);
  return {
    ...tokens,
    user: toUserResponse(user),
  };
}

/**
 * Authenticates a user using email and password.
 *
 * @param payload - Login payload containing email and password.
 * @returns Authentication result with tokens when the credentials are valid.
 */
export async function loginUser(payload: unknown): Promise<AuthResult> {
  const data = loginSchema.parse(payload);
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  await touchUser(user._id);
  const tokens = generateTokens(user);
  return {
    ...tokens,
    user: toUserResponse(user),
  };
}

/**
 * Issues a new pair of tokens based on a refresh token.
 *
 * @param refreshToken - Refresh token string provided by the client.
 * @returns Authentication result with regenerated tokens.
 */
export async function refreshAuthTokens(refreshToken: string): Promise<AuthResult> {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await findUserById(payload.sub);

  if (!user) {
    throw new Error("User not found");
  }

  const tokens = generateTokens(user);
  await touchUser(user._id);
  return {
    ...tokens,
    user: toUserResponse(user),
  };
}

/**
 * Retrieves the current user profile from an identifier.
 *
 * @param userId - User identifier extracted from access token.
 * @returns Partial user information without credentials.
 */
export async function getUserProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return toUserResponse(user);
}

