import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { CMS_TAG } from "@/lib/content";

/**
 * Called by the CMS after every save (Site settings → Frontend): drops the
 * cached CMS responses so the next visit renders the new content. The CMS
 * sends REVALIDATE_SECRET in the `x-revalidate-secret` header.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  // expire: 0 — the next request fetches fresh content instead of being served the old page once more.
  revalidateTag(CMS_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
