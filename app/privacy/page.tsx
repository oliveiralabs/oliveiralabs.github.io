import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Privacy", description: "Privacy information for the Mega Drum app and website.", path: "/privacy/", locale: "en" });

export default function Page() {
  return <ContentPage locale="en" eyebrow="Privacy and transparency" title="Your privacy matters" lead="The Mega Drum Privacy Policy covers both the app and this website."><p className="notice">Read the <a href="/privacy-policy-megadrum.html">Mega Drum Privacy Policy</a>.</p><h2>Website analytics</h2><p>We use Google Analytics to understand aggregated page visits, traffic sources, engagement, and website performance. This information helps us improve the Mega Drum web experience.</p><h2>Website privacy controls</h2><p>Where required, the website asks for consent before loading advertising. You can review or withdraw your choice through “Privacy preferences” in the footer.</p><h2>Other Oliveira Labs apps</h2><p>Privacy policies for other Oliveira Labs apps remain available at their original addresses.</p></ContentPage>;
}
