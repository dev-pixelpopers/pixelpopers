import { NextResponse, type NextRequest } from "next/server";

import { postToCms } from "@/lib/content";

/**
 * The site's forms (contact, newsletter, comment) post here; this forwards
 * them to the CMS on the server, so browsers never need the CMS's address and
 * CORS never comes into it. 503 means the CMS isn't connected or reachable.
 */
const TARGETS: Record<string, (body: Record<string, unknown>) => string | null> = {
  contact: () => "/contact",
  newsletter: () => "/newsletter",
  comment: (body) => (typeof body.slug === "string" && /^[a-z0-9-]+$/.test(body.slug) ? `/posts/${body.slug}/comments` : null),
};

export async function POST(request: NextRequest, ctx: RouteContext<"/api/forms/[form]">) {
  const { form } = await ctx.params;
  const target = TARGETS[form];
  if (!target) return NextResponse.json({ message: "Unknown form." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const path = body ? target(body) : null;
  if (!body || !path) return NextResponse.json({ message: "Invalid submission." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const result = await postToCms(path, body, ip);
  if (!result) {
    return NextResponse.json({ message: "We couldn’t send that right now — please email us instead." }, { status: 503 });
  }

  return NextResponse.json(result.body, { status: result.status });
}
