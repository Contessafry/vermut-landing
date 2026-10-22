import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "run-windows-steam-games-on-apple-silicon";
export const metadata = guideMetadata(slug);

export default function Page() {
  return <GuidePage slug={slug} />;
}
