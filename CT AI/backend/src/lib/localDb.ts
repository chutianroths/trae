import { promises as fs } from "fs";
import path from "path";

import type { StoredModule } from "@/types/module";
import type { StoredPrompt } from "@/types/prompt";
import type { StoredUser } from "@/types/user";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const MODULES_FILE = path.join(DATA_DIR, "modules.json");
const PROMPTS_FILE = path.join(DATA_DIR, "prompts.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await ensureDataDir();
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
      return fallback;
    }
    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function loadUsers(): Promise<StoredUser[]> {
  return readJsonFile<StoredUser[]>(USERS_FILE, []);
}

export async function saveUsers(users: StoredUser[]): Promise<void> {
  await writeJsonFile(USERS_FILE, users);
}

export async function loadModules(): Promise<StoredModule[]> {
  return readJsonFile<StoredModule[]>(MODULES_FILE, []);
}

export async function saveModules(modules: StoredModule[]): Promise<void> {
  await writeJsonFile(MODULES_FILE, modules);
}

export async function loadPrompts(): Promise<StoredPrompt[]> {
  return readJsonFile<StoredPrompt[]>(PROMPTS_FILE, []);
}

export async function savePrompts(prompts: StoredPrompt[]): Promise<void> {
  await writeJsonFile(PROMPTS_FILE, prompts);
}

export async function verifyStorage(): Promise<boolean> {
  try {
    await ensureDataDir();
    await fs.access(DATA_DIR);
    return true;
  } catch (error) {
    console.error("Local storage verification failed", error);
    return false;
  }
}

