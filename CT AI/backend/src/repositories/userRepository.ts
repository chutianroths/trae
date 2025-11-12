import { randomUUID } from "crypto";

import { loadUsers, saveUsers } from "@/lib/localDb";
import type { CreateUserInput, StoredUser, User } from "@/types/user";

function toUser(stored: StoredUser): User {
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

function toStored(user: User): StoredUser {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await loadUsers();
  const match = users.find((user) => user.email === email.toLowerCase());
  return match ? toUser(match) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await loadUsers();
  const match = users.find((user) => user._id === id);
  return match ? toUser(match) : null;
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const users = await loadUsers();
  const now = new Date();

  if (users.some((user) => user.email === data.email.toLowerCase())) {
    throw new Error("Email already registered");
  }

  const user: User = {
    _id: randomUUID(),
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name,
    role: data.role,
    createdAt: now,
    updatedAt: now,
  };

  users.push(toStored(user));
  await saveUsers(users);
  return user;
}

export async function touchUser(id: string): Promise<void> {
  const users = await loadUsers();
  const index = users.findIndex((user) => user._id === id);
  if (index === -1) {
    return;
  }

  users[index] = {
    ...users[index],
    updatedAt: new Date().toISOString(),
  };

  await saveUsers(users);
}

