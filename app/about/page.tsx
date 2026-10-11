import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "About Mega Drum", description: "Learn about Mega Drum and its public drum-kit catalog.", path: "/about/", locale: "en" });

export default function Page() { return <ContentPage locale="en" eyebrow="About the project" title="A drum kit in your pocket" lead="Mega Drum is a mobile drum experience by Oliveira Labs, built for practice, creativity, and playing anywhere."><h2>Why this catalog exists</h2><p>The public website makes kits easier to discover, share, and revisit. Each page represents a kit already available in the app; the sounds themselves remain part of the mobile experience.</p><h2>Built from the official catalog</h2><p>Kit names, identifiers, and covers come from the same read-only catalog used by Mega Drum. The website does not write back to production data.</p></ContentPage>; }
