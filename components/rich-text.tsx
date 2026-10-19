import type { Rich } from "@/lib/content";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Renders typed inline copy (strings + links) from content.ts. */
export function RichText({ value }: { value: Rich }) {
  return (
    <>
      {value.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <a
            key={i}
            href={part.href}
            className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground"
            {...(isExternal(part.href) ? { rel: "noopener" } : {})}
          >
            {part.text}
          </a>
        ),
      )}
    </>
  );
}
