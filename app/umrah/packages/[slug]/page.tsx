import { notFound } from "next/navigation";
import { PackageDetailPage } from "@/components/templates/PackageDetailPage";
import { getPackage, packages } from "@/data/packages";
import { createMetadata } from "@/lib/seo";
import { packagePath } from "@/lib/links";
type Props = { params: Promise<{ slug: string;  }> };
export function generateStaticParams() { return packages.filter(item => item.kind === "umrah").map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props) {
  const p = await params;
  const item = getPackage("umrah", p.slug);
  if (!item) notFound();
  return createMetadata({ ...item.seo, noIndex: item.status === "draft" || item.seo.noIndex }, packagePath(item));
}
export default async function Page({ params }: Props) {
  const p = await params;
  const item = getPackage("umrah", p.slug);
  if (!item) notFound();
  return <PackageDetailPage item={item} />;
}

