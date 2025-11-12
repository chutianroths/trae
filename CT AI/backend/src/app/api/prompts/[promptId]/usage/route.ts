import { NextRequest } from "next/server";

import { trackPromptUsage } from "@/services/promptService";
import { jsonError, jsonSuccess } from "@/utils/apiResponse";

/**
 * Tracks usage metrics for a prompt template.
 *
 * @param request - Request containing usage result.
 * @param context - Route parameters (promptId).
 */
export async function POST(
  request: NextRequest,
  context: { params: { promptId: string } },
) {
  try {
    const { promptId } = context.params;
    const body = await request.json();
    const success = Boolean(body?.success);

    await trackPromptUsage(promptId, success);
    return jsonSuccess({ promptId, success });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to track prompt usage";
    return jsonError(message, 400);
  }
}

