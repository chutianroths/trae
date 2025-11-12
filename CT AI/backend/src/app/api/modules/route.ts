import { NextRequest } from "next/server";

import { generateModuleResult, getModules, mapToModulePreviews, seedModules } from "@/services/moduleService";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

const sampleModules = [
  {
    moduleId: "line-colorizer",
    name: "线稿上色",
    version: "1.0.0",
    description: "自动识别线稿并进行智能上色，支持多种画风。",
    category: "repair",
    enabled: true,
    tags: ["line-art", "colorize", "sketch"],
    capabilities: [
      { name: "auto-palette", description: "根据线稿自动生成调色板" },
      { name: "style-transfer", description: "支持多种风格模板" },
    ],
    parameters: [
      {
        key: "style",
        label: "风格",
        type: "select",
        required: true,
        defaultValue: "classic",
        options: [
          { value: "classic", label: "经典" },
          { value: "anime", label: "动漫" },
          { value: "oil", label: "油画" },
        ],
      },
      {
        key: "color_intensity",
        label: "色彩强度",
        type: "number",
        required: false,
        defaultValue: 0.8,
      },
    ],
    models: [
      { model: "gemini-2.5-flash-image", default: true },
      { model: "wenxin-colorizer", default: false },
    ],
    visibility: ["admin", "editor", "user"],
    provider: "CT AI Studio",
    costTier: "standard",
    rating: 4.7,
    usageCount: 12452,
  },
  {
    moduleId: "portrait-cleaner",
    name: "人物消除",
    version: "1.1.0",
    description: "智能移除图片中的人物或物体，并进行背景修复。",
    category: "repair",
    enabled: true,
    tags: ["cleanup", "object-removal"],
    capabilities: [
      { name: "mask-generation", description: "自动识别目标区域" },
      { name: "background-inpaint", description: "对被移除区域进行补全" },
    ],
    parameters: [
      {
        key: "mask_precision",
        label: "遮罩精度",
        type: "number",
        required: false,
        defaultValue: 0.9,
      },
      {
        key: "restore_background",
        label: "背景修复",
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    ],
    models: [
      { model: "gemini-2.5-flash-image", default: true },
      { model: "spark-removal", default: false },
    ],
    visibility: ["admin", "editor"],
    provider: "CT AI Studio",
    costTier: "premium",
    rating: 4.5,
    usageCount: 8230,
  },
];

/**
 * Returns a paginated list of editing modules available in the internal marketplace.
 *
 * @param request - Incoming request with search and filtering parameters.
 * @returns JSON response containing pagination metadata and module list.
 */
export async function GET(request: NextRequest) {
  try {
    await seedModules(sampleModules);

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const result = await getModules(searchParams);
    const previews = mapToModulePreviews(result.items);

    return jsonSuccess({
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
      items: previews,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch modules";
    return jsonError(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body?.prompt;
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return jsonError("Prompt is required", 400);
    }

    const imageData = await generateModuleResult(prompt);
    return jsonSuccess({
      image: imageData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate module result";
    return jsonError(message, 500);
  }
}

