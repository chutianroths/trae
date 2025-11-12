import { describe, expect, it, vi } from "vitest";

import { getModules, mapToModulePreviews, seedModules } from "./moduleService";
import * as moduleRepository from "@/repositories/moduleRepository";
import type { ModuleDocument } from "@/types/module";

vi.mock("@/repositories/moduleRepository");

const sampleModule: ModuleDocument = {
  _id: "module-1",
  moduleId: "line-colorizer",
  name: "线稿上色",
  version: "1.0.0",
  description: "自动识别线稿并进行智能上色，支持多种画风。",
  category: "repair",
  enabled: true,
  tags: ["line-art", "colorize"],
  capabilities: [
    { name: "auto", description: "自动上色" },
    { name: "style", description: "风格转换" },
  ],
  parameters: [],
  models: [{ model: "gemini-2.5-flash-image", default: true }],
  visibility: ["admin", "editor", "user"],
  provider: "CT AI Studio",
  costTier: "standard",
  rating: 4.7,
  usageCount: 1024,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("moduleService", () => {
  it("getModules parses query and returns list result", async () => {
    vi.spyOn(moduleRepository, "listModules").mockResolvedValue({
      items: [sampleModule],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    const result = await getModules({ category: "repair", page: "1" });

    expect(moduleRepository.listModules).toHaveBeenCalledWith({
      page: 1,
      pageSize: undefined,
      filter: {
        category: "repair",
        enabled: undefined,
        visibility: undefined,
        search: undefined,
        tags: undefined,
      },
      sort: undefined,
    });
    expect(result.total).toBe(1);
  });

  it("mapToModulePreviews returns lightweight previews", () => {
    const previews = mapToModulePreviews([sampleModule]);

    expect(previews).toHaveLength(1);
    expect(previews[0]).toEqual(
      expect.objectContaining({
        moduleId: "line-colorizer",
        name: "线稿上色",
        category: "repair",
        costTier: "standard",
      }),
    );
  });

  it("seedModules inserts missing modules only", async () => {
    const findSpy = vi.spyOn(moduleRepository, "findModuleByModuleId");
    const createSpy = vi.spyOn(moduleRepository, "createModule");

    findSpy.mockResolvedValue(null);
    createSpy.mockResolvedValue(sampleModule);

    await seedModules([
      {
        moduleId: "line-colorizer",
        name: "线稿上色",
        version: "1.0.0",
        description: "自动识别线稿并进行智能上色，支持多种画风。",
        category: "repair",
        enabled: true,
        tags: ["line-art"],
        capabilities: [],
        parameters: [],
        models: [],
        visibility: ["user"],
        provider: "CT AI Studio",
        costTier: "standard",
        rating: 0,
        usageCount: 0,
      },
    ]);

    expect(findSpy).toHaveBeenCalledWith("line-colorizer");
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});

