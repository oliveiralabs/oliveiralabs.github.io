import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Website terms", description: "Terms for using the public Mega Drum website and catalog.", path: "/terms/", locale: "en", index: false });

export default function Page() { return <ContentPage locale="en" eyebrow="Legal" title="Website terms" lead="These draft website terms are included for preview and require owner approval before production."><p className="notice">Not yet a published legal document. The current production policies remain unchanged.</p><h2>Catalog information</h2><p>The site presents public information about kits available in Mega Drum. Availability, names, artwork, and app features may change as the catalog evolves.</p><h2>Acceptable use</h2><p>Do not misuse the site, interfere with its operation, or attempt to redistribute protected app assets outside the permissions granted by their owners.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:antonio.filho128@gmail.com">antonio.filho128@gmail.com</a>.</p></ContentPage>; }
