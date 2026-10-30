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
async function redirectToGithub(request: Request) {
  await connection();
  const url = new URL(request.url);
  const channel = parseChannel(url.searchParams.get("channel"));
  const dest = await destinationFor(channel);
  const response = NextResponse.redirect(dest, 302);
  response.headers.set("Cache-Control", "private, no-store");
  return { url, channel, response };
}

export async function GET(request: Request) {
  const { url, channel, response } = await redirectToGithub(request);
  // after() runs once the 302 has been sent. Counting must never delay the
  // download — a hung Blob write is capped inside recordDownloadClick.
  after(() =>
    recordDownloadClick({
      channel,
      source: sanitizeSource(url.searchParams.get("src")),
      path: sanitizePath(url.searchParams.get("path")),
    }),
  );
  return response;
}

/** Probes must not increment the counter. */
export async function HEAD(request: Request) {
  const { response } = await redirectToGithub(request);
  return response;
}
