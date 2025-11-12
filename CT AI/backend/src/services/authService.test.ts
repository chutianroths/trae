import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerUser, loginUser, refreshAuthTokens } from "./authService";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createUser,
  findUserByEmail,
  findUserById,
  touchUser,
} from "@/repositories/userRepository";
import type { User } from "@/types/user";
import type { RefreshTokenPayload } from "@/lib/jwt";

vi.mock("@/lib/jwt");
vi.mock("@/lib/password");
vi.mock("@/repositories/userRepository");

const baseUser: User = {
  _id: "user-1",
  email: "test@example.com",
  passwordHash: "hashed",
  name: "Test User",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("authService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(signAccessToken).mockReturnValue("access-token");
    vi.mocked(signRefreshToken).mockReturnValue("refresh-token");
  });

  it("registerUser creates a new account", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(null);
    vi.mocked(hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(createUser).mockResolvedValue({
      ...baseUser,
      passwordHash: "hashed-password",
    } as User);

    const result = await registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(createUser).toHaveBeenCalled();
    expect(result.accessToken).toBe("access-token");
    expect(result.user.email).toBe("test@example.com");
  });

  it("loginUser validates credentials", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(baseUser);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(touchUser).mockResolvedValue();

    const result = await loginUser({
      email: "test@example.com",
      password: "password123",
    });

    expect(verifyPassword).toHaveBeenCalledWith("password123", "hashed");
    expect(touchUser).toHaveBeenCalledWith(baseUser._id);
    expect(result.refreshToken).toBe("refresh-token");
  });

  it("refreshAuthTokens issues new tokens", async () => {
    const refreshPayload: RefreshTokenPayload = {
      sub: baseUser._id,
      role: "user",
      type: "refresh",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60,
    };

    vi.mocked(verifyRefreshToken).mockReturnValue(refreshPayload);
    vi.mocked(findUserById).mockResolvedValue(baseUser);
    vi.mocked(touchUser).mockResolvedValue();

    const result = await refreshAuthTokens("refresh-token");

    expect(findUserById).toHaveBeenCalledWith(baseUser._id);
    expect(result.accessToken).toBe("access-token");
  });
});

