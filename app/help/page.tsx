import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Help and support", description: "Get help with Mega Drum kits, sound, downloads, subscriptions, and the app.", path: "/help/", locale: "en" });

export default function Page() {
  return <ContentPage locale="en" eyebrow="Help center" title="How can we help?" lead="Find answers about kits, downloads, sound, subscriptions, and using Mega Drum."><p className="notice">The detailed, production support page remains available at <a href="/megadrum-support.html">Mega Drum Support</a>.</p><h2>Contact Oliveira Labs</h2><p>Email <a href="mailto:antonio.filho128@gmail.com">antonio.filho128@gmail.com</a> and include your device, operating-system version, app version, and a short description of what happened.</p></ContentPage>;
}
