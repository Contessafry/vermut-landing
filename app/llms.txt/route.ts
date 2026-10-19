import { llmsTxt } from "@/lib/llms";

/** Prerendered at build time (no request data is read). */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
