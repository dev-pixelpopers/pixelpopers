/**
 * Browser side of the site's forms. Each posts to a route handler in
 * app/api/forms/*, which forwards to the CMS (CMS_API_URL) on the server.
 */
export type FormResult =
  | { ok: true; message: string }
  | { ok: false; message: string; errors?: Record<string, string[]>; offline?: boolean };

export async function submitForm(form: "contact" | "newsletter" | "comment", payload: Record<string, unknown>): Promise<FormResult> {
  try {
    const res = await fetch(`/api/forms/${form}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string[]> };
    if (res.ok) return { ok: true, message: body.message ?? "Thanks!" };
    return {
      ok: false,
      message: body.message ?? "Something went wrong — please try again.",
      errors: body.errors,
      // 503: no CMS configured or it's unreachable — callers can fall back (e.g. to email).
      offline: res.status === 503,
    };
  } catch {
    return { ok: false, message: "Couldn’t reach us — check your connection and try again.", offline: true };
  }
}
