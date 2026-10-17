import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "About Mega Drum", description: "Learn about Mega Drum and its public drum-kit catalog.", path: "/about/", locale: "en" });

export default function Page() { return <ContentPage locale="en" eyebrow="About Mega Drum" title="A drum kit in your pocket" lead="Mega Drum is a mobile drum experience by Oliveira Labs, built for practice, creativity, and playing anywhere."><h2>Discover your next sound</h2><p>Explore the official Mega Drum kit collection, find a setup that fits your style, and keep your favorites close whenever inspiration strikes.</p><h2>Built to be played</h2><p>From responsive multi-touch controls to recording your ideas, Mega Drum turns your phone or tablet into a creative space for drummers of every level.</p></ContentPage>; }
