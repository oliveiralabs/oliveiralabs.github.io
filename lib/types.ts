export type Locale = "en" | "pt";
export type KitAccess = "app_unlock" | "task" | "lesson" | "premium";

export type Kit = {
  id: string;
  name: string;
  slug: string;
  access: KitAccess;
  isPremium: boolean;
  isDefault: boolean;
  needUserTask: boolean;
  unlockLessonId: string | null;
  sortOrder: number;
  cover: string;
  sourceCoverUrl: string;
  approvedForIndexing: boolean;
  featured: boolean;
  description: string | null;
  descriptionPt: string | null;
  tags: string[];
};
