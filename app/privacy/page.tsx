import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Privacy", description: "Mega Drum privacy information and the current official Privacy Policy.", path: "/privacy/", locale: "en" });

export default function Page() {
  return <ContentPage locale="en" eyebrow="Privacy and transparency" title="Your privacy matters" lead="The existing legal document remains the authoritative Mega Drum Privacy Policy."><p className="notice">Read the current official document at <a href="/privacy-policy-megadrum.html">Mega Drum Privacy Policy</a>. This friendly route does not replace or modify that document.</p><h2>Other Oliveira Labs apps</h2><p>Existing privacy-policy URLs for other apps remain available at their original paths. The new site build verifies that those files are copied without changes.</p></ContentPage>;
}
