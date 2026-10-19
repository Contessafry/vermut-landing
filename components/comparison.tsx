import { Check, Minus, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDictionary } from "@/lib/i18n";
import type { CompareCell } from "@/lib/content";
import { cn } from "@/lib/utils";
import { RichText } from "./rich-text";
import { SectionHeading } from "./section-heading";

const toneIcon = {
  yes: { Icon: Check, className: "text-success-subtle-foreground" },
  no: { Icon: X, className: "text-muted-foreground" },
  neutral: { Icon: Minus, className: "text-muted-foreground" },
} as const;

function Cell({ cell }: { cell: CompareCell }) {
  const { Icon, className } = toneIcon[cell.tone ?? "neutral"];
  return (
    <div className="flex gap-2">
      <Icon className={cn("mt-[3px] size-4 shrink-0", className)} aria-hidden="true" />
      <div>
        <div className="font-medium text-foreground">{cell.value}</div>
        {cell.note ? <div className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">{cell.note}</div> : null}
      </div>
    </div>
  );
}

export async function Comparison() {
  const content = await getDictionary();
  const s = content.comparison;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="py-24 md:py-32">
      <div className="container-page grid-page gap-y-12">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />

        {/* Mobile: one card per criterion (a 5-column table doesn't fit 390px). */}
        <ul className="col-span-full flex flex-col gap-4 md:hidden">
          {s.rows.map((row) => (
            <li key={row.label} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold text-foreground">{row.label}</h3>
              <dl className="mt-3 flex flex-col">
                {row.cells.map((cell, i) => (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-[6.25rem_1fr] gap-3 border-t py-3 first:border-t-0",
                      i === 0 && "-mx-3 rounded-lg border-t-0 bg-neutral-100 px-3",
                    )}
                  >
                    <dt className={cn("text-[0.9375rem]", i === 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {s.columns[i]}
                    </dt>
                    <dd className="text-[0.9375rem]">
                      <Cell cell={cell} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        <div className="col-span-full hidden md:block">
          <Table className="min-w-[760px] table-fixed border-separate border-spacing-0 text-[0.9375rem]">
            <caption className="sr-only">
              {content.ui.compareCaption}
            </caption>
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[19.5%]" />
              <col className="w-[19.5%]" />
              <col className="w-[19.5%]" />
              <col className="w-[19.5%]" />
            </colgroup>
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky left-0 z-10 bg-background">
                  <span className="sr-only">{content.ui.feature}</span>
                </TableHead>
                {s.columns.map((c, i) => (
                  <TableHead
                    key={c}
                    scope="col"
                    className={cn(
                      "h-auto px-4 pt-5 pb-4 align-bottom font-display text-[1.5rem] font-extrabold text-foreground",
                      i === 0 && "rounded-t-xl bg-neutral-950 text-white",
                    )}
                  >
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.rows.map((row, r) => (
                <TableRow key={row.label} className="hover:bg-transparent">
                  <TableHead
                    scope="row"
                    className="sticky left-0 z-10 h-auto border-t bg-background py-4 pr-4 pl-0 align-top font-medium whitespace-normal text-foreground"
                  >
                    {row.label}
                  </TableHead>
                  {row.cells.map((cell, i) => (
                    <TableCell
                      key={i}
                      className={cn(
                        "border-t px-4 py-4 align-top whitespace-normal",
                        i === 0 && "border-x border-x-neutral-950 border-t-neutral-200 bg-neutral-50",
                        i === 0 && r === s.rows.length - 1 && "rounded-b-xl border-b border-b-neutral-950",
                      )}
                    >
                      <Cell cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="col-span-full grid gap-10 md:grid-cols-12 md:gap-6">
          <p className="self-start rounded-xl border bg-neutral-50 p-6 text-body text-pretty md:col-span-6">
            <RichText value={s.aside} />
          </p>
          <div className="md:col-span-5 md:col-start-8">
            <h3 className="font-mono text-eyebrow uppercase text-muted-foreground">{s.sourcesTitle}</h3>
            <ol className="mt-4 flex flex-col gap-1.5 text-[0.875rem] text-muted-foreground">
              {s.sources.map((src) => (
                <li key={src.id} className="flex gap-2">
                  <span className="w-7 shrink-0 font-mono tabular-nums">[{src.id}]</span>
                  <a href={src.href} rel="noopener" className="underline decoration-foreground/25 underline-offset-[3px] hover:text-foreground hover:decoration-foreground">
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
