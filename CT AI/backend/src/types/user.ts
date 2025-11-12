export type UserRole = "admin" | "editor" | "user";

export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

export interface StoredUser extends Omit<User, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

