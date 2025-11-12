import { describe, expect, it, vi } from "vitest";

import {
  createPromptEntry,
  ensurePromptSeeds,
  getPrompts,
  mapToPromptPreviews,
  trackPromptUsage,
} from "./promptService";
import * as promptRepository from "@/repositories/promptRepository";
import type { PromptDocument } from "@/types/prompt";

vi.mock("@/repositories/promptRepository");

const basePrompt: PromptDocument = {
  _id: "prompt-1",
  promptId: "portrait-enhance-basic",
  name: "人像增强基础版",
  content: "Enhance portrait with natural retouching.",
  category: "portrait",
  visibility: "public",
  accessLevel: ["admin", "editor", "user"],
  createdBy: "system",
  usageCount: 10,
  successRate: 0.8,
  tags: ["portrait"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("promptService", () => {
  it("ensurePromptSeeds inserts missing prompts", async () => {
    vi.spyOn(promptRepository, "findPromptByPromptId")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const createSpy = vi
      .spyOn(promptRepository, "createPrompt")
      .mockResolvedValue(basePrompt);

    await ensurePromptSeeds();

    expect(createSpy).toHaveBeenCalled();
  });

  it("getPrompts parses query parameters correctly", async () => {
    vi.spyOn(promptRepository, "listPrompts").mockResolvedValue({
      items: [basePrompt],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    const result = await getPrompts({ category: "portrait", page: "1" });

    expect(promptRepository.listPrompts).toHaveBeenCalledWith({
      page: 1,
      pageSize: undefined,
      filter: {
        category: "portrait",
        visibility: undefined,
        accessLevel: undefined,
        search: undefined,
        tags: undefined,
      },
      sort: undefined,
    });
    expect(result.total).toBe(1);
  });

  it("mapToPromptPreviews returns simplified data", () => {
    const previews = mapToPromptPreviews([basePrompt]);
    expect(previews).toEqual([
      {
        promptId: "portrait-enhance-basic",
        name: "人像增强基础版",
        category: "portrait",
        visibility: "public",
        accessLevel: ["admin", "editor", "user"],
        usageCount: 10,
        successRate: 0.8,
        tags: ["portrait"],
      },
    ]);
  });

  it("createPromptEntry rejects duplicate prompt IDs", async () => {
    vi.spyOn(promptRepository, "findPromptByPromptId").mockResolvedValue(basePrompt);

    await expect(
      createPromptEntry({
        promptId: basePrompt.promptId,
        name: basePrompt.name,
        content: basePrompt.content,
        category: basePrompt.category,
        visibility: "public",
        accessLevel: ["user"],
        createdBy: "test",
        tags: [],
      }),
    ).rejects.toThrow("Prompt ID already exists");
  });

  it("trackPromptUsage delegates to repository", async () => {
    const usageSpy = vi
      .spyOn(promptRepository, "updatePromptUsage")
      .mockResolvedValue();

    await trackPromptUsage("portrait-enhance-basic", true);
    expect(usageSpy).toHaveBeenCalledWith("portrait-enhance-basic", true);
  });
});

