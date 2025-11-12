import { NextResponse } from "next/server";

import { env } from "@/config/env";
import { verifyStorage } from "@/lib/localDb";

export const dynamic = "force-dynamic";

export async function GET() {
  const storageHealthy = await verifyStorage();

  return NextResponse.json(
    {
      status: "ok",
      environment: env.NODE_ENV,
      storage: storageHealthy ? "available" : "error",
      timestamp: new Date().toISOString(),
    },
    {
      status: storageHealthy ? 200 : 503,
    },
  );
}

