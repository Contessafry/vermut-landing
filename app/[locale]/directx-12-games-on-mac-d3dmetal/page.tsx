import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "directx-12-games-on-mac-d3dmetal";

export async function generateMetadata({ params }: PageProps<"/[locale]/directx-12-games-on-mac-d3dmetal">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
