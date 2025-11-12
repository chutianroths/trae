import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password with a salt.
 *
 * @param password - Plain text password provided by the user.
 * @returns Promise resolving to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - Incoming plain text password to validate.
 * @param hash - Stored password hash to compare against.
 * @returns Promise resolving to `true` when passwords match, otherwise `false`.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

