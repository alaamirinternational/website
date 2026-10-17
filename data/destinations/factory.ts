import type { Destination } from "@/types/content";
import { draftPackage } from "@/data/packages/factory";
/** Empty fields intentionally avoid unverified travel, visa and business claims. */
export function defineDestination(input: Pick<Destination, "name" | "slug" | "hero" | "introduction" | "seo" | "todos">): Destination {
  return { ...input, status: "draft", travelNotes: [], visaInformation: [], highlights: [], whyVisit: [], packages: [draftPackage("international", `${input.name} tour package preview`, input.slug)], itinerary: [], inclusions: [], travelTips: [], gallery: [], faqs: [], relatedSlugs: [] };
}
