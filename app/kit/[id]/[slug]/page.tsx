import { notFound } from "next/navigation";
import { KitDetailPage } from "@/components/KitDetailPage";
import { getAllKits, getKit, kitDescription, kitRoute } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getAllKits().map((kit) => ({ id: kit.id, slug: kit.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const kit = getKit(id);
  if (!kit || kit.slug !== slug) return {};
  return pageMetadata({
    title: `${kit.name} drum kit`,
    description: kitDescription(kit, "en"),
    path: kitRoute(kit, "en"),
    locale: "en",
    index: kit.approvedForIndexing,
    image: kit.cover,
  });
}

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const kit = getKit(id);
  if (!kit || kit.slug !== slug) notFound();
  return <KitDetailPage kit={kit} locale="en" />;
}
