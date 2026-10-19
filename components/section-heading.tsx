import { cn } from "@/lib/utils";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
};

/** Left-aligned section header: mono eyebrow, display H2, optional lead. */
export function SectionHeading({ id, eyebrow, title, lead, className }: Props) {
  return (
    <header className={cn("col-span-full md:col-span-8 lg:col-span-7", className)}>
      <p className="font-mono text-eyebrow uppercase text-muted-foreground">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-4 font-display text-h2 font-extrabold text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground text-pretty">{lead}</p>
      ) : null}
    </header>
  );
}
