import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="on-brand flex min-h-dvh flex-col items-start justify-center bg-brand px-6 text-white md:px-16">
      <p className="font-mono text-eyebrow uppercase">404</p>
      <h1 className="mt-4 font-display text-h2 font-extrabold">This glass is empty.</h1>
      <p className="mt-4 max-w-[40ch] text-lead">The page you were looking for doesn&apos;t exist. Vermut lives on the home page.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-neutral-950 hover:bg-neutral-100">
        <ArrowLeft className="size-5" aria-hidden="true" />
        Back to Vermut
      </Link>
    </main>
  );
}
