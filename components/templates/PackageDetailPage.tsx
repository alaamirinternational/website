import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { JsonLd } from "@/components/common/JsonLd";
import { PackageHeroSection } from "@/components/sections/PackageHeroSection";
import { QuickFactsSection } from "@/components/sections/QuickFactsSection";
import { ContentSection } from "@/components/sections/ContentSection";
import { ItinerarySection } from "@/components/sections/ItinerarySection";
import { DestinationHighlightsSection } from "@/components/sections/DestinationHighlightsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { TeamSection } from "@/components/sections/TeamSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { PackageGridSection } from "@/components/sections/PackageGridSection";
import { LeadCTASection } from "@/components/sections/LeadCTASection";
import { packages } from "@/data/packages";
import { teamMembers } from "@/data/company";
import { packagePath } from "@/lib/links";
import { tripSchema } from "@/lib/schema";
import type { Package } from "@/types/content";
export function PackageDetailPage({ item }: { item: Package }) {
  const parent = item.kind === "international" ? `/international-tours/${item.country}` : item.kind === "pakistan" ? "/pakistan-tours" : `/${item.kind}/packages`;
  return <>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: item.country ?? `${item.kind[0].toUpperCase()}${item.kind.slice(1)} packages`, href: parent }, { label: item.title, href: packagePath(item) }]} />
    <PackageHeroSection item={item} /><JsonLd data={tripSchema(item)} />
    <QuickFactsSection facts={item.facts} />
    <ContentSection id="flights" title="Flight details" blocks={item.flights} />
    <ContentSection id="hotels" title="Hotel details" blocks={item.hotels} />
    <ContentSection id="transport" title="Transport details" blocks={item.transport} />
    <ItinerarySection days={item.itinerary} />
    <ContentSection id="inclusions" title="What is included?" items={item.inclusions} />
    <ContentSection id="exclusions" title="What is excluded?" items={item.exclusions} />
    {(item.kind === "umrah" || item.kind === "hajj" || item.ziyarat.length > 0) && <DestinationHighlightsSection id="ziyarat" title="Ziyarat" highlights={item.ziyarat} />}
    <ContentSection id="booking-payment" title="Booking and payment" blocks={item.booking} />
    <GallerySection images={item.gallery} /><TeamSection members={teamMembers.filter(member => item.teamIds.includes(member.id))} />
    <FAQSection faqs={item.faqs} />
    <PackageGridSection id="related-packages" title="Related packages" packages={packages.filter(other => other.kind === item.kind && other.country === item.country && other.slug !== item.slug && item.relatedSlugs.includes(other.slug))} />
    <LeadCTASection cta={item.primaryCTA} message={item.whatsappMessage} />
  </>;
}
