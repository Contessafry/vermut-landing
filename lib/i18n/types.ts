/** Shared content types for all dictionaries. */
/** Inline rich text: plain strings and links. */
export type Rich = ReadonlyArray<string | { readonly text: string; readonly href: string }>;

export type NavItem = { readonly label: string; readonly href: string };

export type Step = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly video: {
    readonly mp4: string;
    readonly webm: string;
    readonly poster: string;
    readonly width: number;
    readonly height: number;
    /** Accessible description of what the clip shows (no audio, no captions needed). */
    readonly description: string;
  };
};

export type CompatGroup = {
  readonly id: "runs" | "setup" | "no";
  readonly title: string;
  readonly items: readonly Rich[];
};

export type CompareCell = { readonly value: string; readonly note?: string; readonly tone?: "yes" | "no" | "neutral" };
export type CompareRow = { readonly label: string; readonly cells: readonly [CompareCell, CompareCell, CompareCell, CompareCell] };
export type Source = { readonly id: number; readonly label: string; readonly href: string };

export type Faq = { readonly q: string; readonly a: Rich };


/**
 * Shape every translation must satisfy: the English dictionary with string
 * literals widened to `string`. Discriminant keys (`id`, `tone`, `locale`) keep
 * their literal types so components can switch on them.
 */
type Keep = "id" | "tone";
export type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : T extends object
        ? { readonly [K in keyof T]: K extends Keep ? T[K] : Widen<T[K]> }
        : T;
