import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "wine-bottles-and-game-settings-mac";

export async function generateMetadata({ params }: PageProps<"/[locale]/wine-bottles-and-game-settings-mac">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
