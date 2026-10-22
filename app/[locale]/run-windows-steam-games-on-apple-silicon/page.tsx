import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "run-windows-steam-games-on-apple-silicon";

export async function generateMetadata({ params }: PageProps<"/[locale]/run-windows-steam-games-on-apple-silicon">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
