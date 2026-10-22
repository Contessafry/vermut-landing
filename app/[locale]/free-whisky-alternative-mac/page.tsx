import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "free-whisky-alternative-mac";

export async function generateMetadata({ params }: PageProps<"/[locale]/free-whisky-alternative-mac">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
