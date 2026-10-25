import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "epic-games-windows-games-on-mac";

export async function generateMetadata({ params }: PageProps<"/[locale]/epic-games-windows-games-on-mac">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
