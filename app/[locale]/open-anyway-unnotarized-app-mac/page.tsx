import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "open-anyway-unnotarized-app-mac";

export async function generateMetadata({ params }: PageProps<"/[locale]/open-anyway-unnotarized-app-mac">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
