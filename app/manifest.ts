import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mega Drum",
    short_name: "Mega Drum",
    description: "Discover drum kits available in the Mega Drum mobile app.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#f8f6f1",
    icons: [{ src: "/brand/new-mega-drum.png", sizes: "512x512", type: "image/png" }],
  };
}
