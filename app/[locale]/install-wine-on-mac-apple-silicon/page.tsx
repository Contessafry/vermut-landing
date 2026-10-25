import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "install-wine-on-mac-apple-silicon";

export async function generateMetadata({ params }: PageProps<"/[locale]/install-wine-on-mac-apple-silicon">) {
  return guideMetadata((await params).locale, slug);
}

export default function Page() {
  return <GuidePage slug={slug} />;
}
