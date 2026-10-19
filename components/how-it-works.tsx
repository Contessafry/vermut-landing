import { content } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { StepVideo } from "./step-video";

export function HowItWorks() {
  const s = content.howItWorks;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="py-24 md:py-32">
      <div className="container-page grid-page">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      </div>
      <ol className="container-page mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
        {s.steps.map((step) => (
          <li key={step.id} className="grid-page items-center gap-y-8">
            <div className="col-span-full lg:col-span-4">
              <p className="flex items-center gap-3 font-mono text-eyebrow text-brand" aria-hidden="true">
                <span>{step.number}</span>
                <span className="h-px w-10 bg-brand/40" />
              </p>
              <h3 className="mt-4 font-display text-[2rem] leading-none font-extrabold md:text-[2.5rem]">
                <span className="sr-only">Step {Number(step.number)}: </span>
                {step.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-body text-muted-foreground text-pretty">{step.body}</p>
              <p id={`${step.id}-video-desc`} className="sr-only">
                {step.video.description}
              </p>
            </div>
            <figure className="col-span-full overflow-hidden rounded-2xl ring-1 ring-neutral-950/8 lg:col-span-8">
              <StepVideo
                {...step.video}
                label={`${step.title}: screen recording of Vermut`}
                descriptionId={`${step.id}-video-desc`}
              />
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
