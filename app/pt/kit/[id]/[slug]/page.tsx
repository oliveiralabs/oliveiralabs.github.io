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
    title: `Kit de bateria ${kit.name}`,
    description: kitDescription(kit, "pt"),
    path: kitRoute(kit, "pt"),
    locale: "pt",
    index: kit.approvedForIndexing,
    image: kit.cover,
  });
}

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const kit = getKit(id);
  if (!kit || kit.slug !== slug) notFound();
  return <div lang="pt-BR"><KitDetailPage kit={kit} locale="pt" /></div>;
}
