import { PlayDrumsPage } from "@/components/PlayDrumsPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Play drums online", description: "Play official Mega Drum kits online with your keyboard, mouse, or touchscreen, and discover more kits in the app.", path: "/", locale: "en" });

export default function Page() { return <PlayDrumsPage locale="en" />; }
