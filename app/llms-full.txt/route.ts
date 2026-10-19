import { llmsFullTxt } from "@/lib/llms";

/** Prerendered at build time (no request data is read). */
export async function GET() {
  return new Response(await llmsFullTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
