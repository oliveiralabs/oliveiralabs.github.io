import { HomePage } from "@/components/HomePage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Find your next drum kit", description: "Explore the drum kits available in Mega Drum and take your next setup to the mobile app.", path: "/", locale: "en" });

export default function Page() { return <HomePage locale="en" />; }
