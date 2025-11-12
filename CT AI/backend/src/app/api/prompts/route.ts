import { NextRequest } from "next/server";

import {
  createPromptEntry,
  ensurePromptSeeds,
  getPrompts,
  mapToPromptPreviews,
} from "@/services/promptService";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

/**
 * Lists prompt templates with pagination and filters.
 *
 * @param request - Incoming request containing query params.
 */
export async function GET(request: NextRequest) {
  try {
    await ensurePromptSeeds();

    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const result = await getPrompts(params);
    const previews = mapToPromptPreviews(result.items);

    return jsonSuccess({
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
      items: previews,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch prompts";
    return jsonError(message, 500);
  }
}

/**
 * Creates a new prompt template. Requires elevated role (admin/editor).
 *
 * @param request - Request containing prompt payload.
 */
export async function POST(request: NextRequest) {
  try {
    const role = request.headers.get("x-user-role") ?? "user";
    if (!["admin", "editor"].includes(role)) {
      return jsonError("Insufficient permissions to create prompts", 403);
    }

    const payload = await request.json();
    if (!payload.createdBy) {
      payload.createdBy = request.headers.get("x-user-id") ?? "system";
    }

    const prompt = await createPromptEntry(payload);
    return jsonSuccess(
      {
        promptId: prompt.promptId,
        name: prompt.name,
        category: prompt.category,
        visibility: prompt.visibility,
        accessLevel: prompt.accessLevel,
        tags: prompt.tags,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create prompt";
    return jsonError(message, 400);
  }
}

