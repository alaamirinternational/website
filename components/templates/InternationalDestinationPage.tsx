import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageHeroSection } from "@/components/sections/PageHeroSection";
import { QuickFactsSection } from "@/components/sections/QuickFactsSection";
import { PackageGridSection } from "@/components/sections/PackageGridSection";
import { DestinationHighlightsSection } from "@/components/sections/DestinationHighlightsSection";
import { ContentSection } from "@/components/sections/ContentSection";
import { ItinerarySection } from "@/components/sections/ItinerarySection";
import { GallerySection } from "@/components/sections/GallerySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { DestinationGridSection } from "@/components/sections/DestinationGridSection";
import { LeadCTASection } from "@/components/sections/LeadCTASection";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/types/content";
export function InternationalDestinationPage({ destination: d }: { destination: Destination }) {
  return <>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "International Tours", href: "/international-tours" }, { label: d.name, href: `/international-tours/${d.slug}` }]} />
    <PageHeroSection {...d.hero} draft={d.status === "draft"} cta={{ label: "Explore packages", href: "#packages" }} />
    <p className="answer-summary">{d.introduction}</p>
    <QuickFactsSection title={`${d.name} quick facts`} facts={[{ label: "Currency", value: d.currency ?? "Awaiting reviewed information" }, { label: "Language", value: d.language ?? "Awaiting reviewed information" }, { label: "Best time to visit", value: d.bestTimeToVisit ?? "Awaiting reviewed information" }]} />
    <PackageGridSection title={`${d.name} tour packages`} packages={d.packages} />
    <DestinationHighlightsSection title={`${d.name} highlights`} highlights={d.highlights} />
    <ContentSection id="why-visit" title={`Why visit ${d.name}?`} blocks={d.whyVisit} />
    <ItinerarySection title={`${d.name} sample itinerary`} days={d.itinerary} />
    <ContentSection id="inclusions" title={`What do ${d.name} packages include?`} items={d.inclusions} />
    <ContentSection id="visa" title={`Visa assistance for ${d.name}`} blocks={d.visaInformation} />
    <ContentSection id="travel-information" title={`${d.name} travel information`} items={[...d.travelNotes, ...d.travelTips]} />
    <GallerySection title={`${d.name} gallery`} images={d.gallery} />
    <ContentSection id="why-choose-us" title={`Planning ${d.name} with AlAamir`} blocks={d.whyChooseUs} />
    <TestimonialsSection testimonials={d.testimonials ?? []} />
    <FAQSection title={`${d.name} travel questions`} faqs={d.faqs} />
    <DestinationGridSection id="related-destinations" title="Explore other destinations" destinations={destinations.filter(item => item.slug !== d.slug && (!d.relatedSlugs.length || d.relatedSlugs.includes(item.slug)))} />
    <LeadCTASection title={`Discuss your ${d.name} travel plans`} cta={{ label: "Request a tour quote", href: "/contact?type=International%20Tour" }} message={`I'm interested in a ${d.name} tour package.`} />
  </>;
}
