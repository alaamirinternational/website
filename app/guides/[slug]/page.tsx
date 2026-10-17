import { notFound } from "next/navigation";
import { GuideArticlePage } from "@/components/templates/GuideArticlePage";
import { guides, getGuideBySlug } from "@/data/guides";
import { createArticleMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return guides.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props) {
  const guide = getGuideBySlug((await params).slug);
  if (!guide) notFound();
  return createArticleMetadata(guide);
}
export default async function Page({ params }: Props) {
  const guide = getGuideBySlug((await params).slug);
  if (!guide) notFound();
  return <GuideArticlePage guide={guide} />;
}
