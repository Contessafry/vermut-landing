import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "run-windows-games-on-mac-without-crossover";

export async function generateMetadata({ params }: PageProps<"/[locale]/run-windows-games-on-mac-without-crossover">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
