import { GuidePage, guideMetadata } from "@/components/guide-page";

const slug = "run-windows-games-on-mac-without-crossover";
export const metadata = guideMetadata(slug);

export default function Page() {
  return <GuidePage slug={slug} />;
}
