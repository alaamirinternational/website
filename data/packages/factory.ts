import type { Package, PackageKind } from "@/types/content";
/** Explicit preview records exercise dynamic routes. Never represent these as bookable offers. */
export function draftPackage(kind: PackageKind, title: string, country?: string): Package {
  return {
    slug: "package-preview", kind, country, title, status: "draft",
    summary: `${title} is a development preview. Package details are awaiting approval.`,
    seo: { title, description: `Preview the information structure for ${title.toLowerCase()}. Confirmed offers will be added after approval.`, noIndex: true },
    primaryCTA: { label: "Enquire about packages", href: `/contact?type=${kind === "international" ? "International%20Tour" : kind === "pakistan" ? "Pakistan%20Tour" : kind === "umrah" ? "Umrah" : "Hajj"}` },
    whatsappMessage: `I'd like information about ${country ? `${country} tours` : `${kind} packages`}.`,
    facts: [], flights: [], hotels: [], transport: [], itinerary: [], inclusions: [], exclusions: [], ziyarat: [], booking: [], gallery: [], teamIds: [], faqs: [], relatedSlugs: [],
  };
}
