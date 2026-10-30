import { after, connection, NextResponse } from "next/server";
import { destinationFor, parseChannel, sanitizePath, sanitizeSource } from "@/lib/download";
import { recordDownloadClick } from "@/lib/download-store";

export const maxDuration = 30;

/**
 * Counted download hop. Always 302s to a hardcoded GitHub URL for the channel.
 * Attribution (`src`) and path are query params from the client; they are never
 * forwarded to GitHub. Counting is best-effort: Blob failures do not affect the
 * redirect.
 */
export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const channel = parseChannel(url.searchParams.get("channel"));
  const dest = await destinationFor(channel);

  const event = {
    channel,
    source: sanitizeSource(url.searchParams.get("src")),
    path: sanitizePath(url.searchParams.get("path")),
  };

  after(() => recordDownloadClick(event));

  const response = NextResponse.redirect(dest, 302);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
