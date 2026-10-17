import { notFound } from "next/navigation";
import { InternationalDestinationPage } from "@/components/templates/InternationalDestinationPage";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ country: string }> };
export function generateStaticParams() { return destinations.map(item => ({ country: item.slug })); }
export async function generateMetadata({ params }: Props) {
  const destination = getDestinationBySlug((await params).country);
  if (!destination) notFound();
  return createMetadata({ ...destination.seo, noIndex: destination.status === "draft" || destination.seo.noIndex }, `/international-tours/${destination.slug}`);
}
export default async function Page({ params }: Props) {
  const destination = getDestinationBySlug((await params).country);
  if (!destination) notFound();
  return <InternationalDestinationPage destination={destination} />;
}

