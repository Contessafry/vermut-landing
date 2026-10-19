import { contentUpdated, links, site } from "@/site.config";

/** RFC 9116. Reports go to GitHub private vulnerability reporting. */
export function GET() {
  const expires = new Date(contentUpdated);
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const body = [
    `Contact: ${links.github}/security/advisories/new`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    `Policy: ${links.github}/security/policy`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
