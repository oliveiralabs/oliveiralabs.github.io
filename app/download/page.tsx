import { ContentPage } from "@/components/ContentPage";
import { StoreButtons } from "@/components/StoreButtons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Download Mega Drum", description: "Get Mega Drum for Android, iPhone, or iPad.", path: "/download/", locale: "en" });

export default function Page() {
  return <ContentPage locale="en" eyebrow="Take your kit anywhere" title="Download Mega Drum" lead="The complete playing experience is available in the mobile app."><StoreButtons locale="en" /><h2>From web to app</h2><p>Kit pages use a stable Mega Drum kit ID. Direct opening on a specific kit will be enabled when compatible Android and iOS releases are available. Until then, install or open Mega Drum and choose the kit by name.</p></ContentPage>;
}
