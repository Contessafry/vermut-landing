import { llmsFullTxt } from "@/lib/llms";

/** Prerendered at build time (no request data is read). */
export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
