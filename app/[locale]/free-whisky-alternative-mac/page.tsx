import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "free-whisky-alternative-mac";
export const metadata = guideMetadata(slug);

export default function Page() {
  return <GuidePage slug={slug} />;
}
