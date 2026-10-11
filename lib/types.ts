export type Locale = "en" | "pt";
export type KitTier = "free" | "premium";

export type Kit = {
  id: string;
  sourceKey: string;
  name: string;
  slug: string;
  tier: KitTier;
  version: string | null;
  cover: string;
  sourceCoverUrl: string;
  approvedForIndexing: boolean;
  featured: boolean;
  description: string | null;
  descriptionPt: string | null;
  tags: string[];
};
