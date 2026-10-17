import { ContentPage } from "@/components/ContentPage";
import { StoreButtons } from "@/components/StoreButtons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Download Mega Drum", description: "Get Mega Drum for Android, iPhone, or iPad.", path: "/download/", locale: "en" });

export default function Page() {
  return <ContentPage locale="en" eyebrow="Take your kit anywhere" title="Download Mega Drum" lead="The complete playing experience is available in the mobile app."><StoreButtons locale="en" /><h2>Everything you need to keep playing</h2><p>Explore the complete Mega Drum catalog, play with responsive multi-touch controls, record your ideas, and take your practice anywhere.</p></ContentPage>;
}
