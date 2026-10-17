export interface ImageAsset { src: string; alt: string; width: number; height: number }
export interface SEOData { title: string; description: string; image?: ImageAsset; noIndex?: boolean }
export interface CTA { label: string; href: string; variant?: "primary" | "secondary" }
export interface FAQ { question: string; answer: string }
export interface ContactDetails { email?: string; phone?: string; whatsapp?: string; address?: string; officeHours?: string; mapUrl?: string }
export interface TourHighlight { title: string; description: string; image?: ImageAsset }
export interface ItineraryDay { day: number; title: string; description: string }
export interface Fact { label: string; value: string }
export interface ContentBlock { id: string; title: string; paragraphs: string[]; items?: string[] }
export interface TeamMember { id: string; name: string; role: string; biography: string; image?: ImageAsset; group: "leadership" | "scholars" | "travel" }
export interface Testimonial { id: string; name: string; quote: string; context: string; consentConfirmed: boolean }
export type PackageKind = "umrah" | "hajj" | "international" | "pakistan";
export interface Package {
  slug: string; kind: PackageKind; country?: string; title: string; summary: string;
  status: "draft" | "published"; seo: SEOData; location?: string; image?: ImageAsset;
  price?: { amount: number; currency: string; basis: string }; duration?: string;
  departureDate?: string; returnDate?: string; availability?: string;
  primaryCTA: CTA; whatsappMessage: string; facts: Fact[];
  flights: ContentBlock[]; hotels: ContentBlock[]; transport: ContentBlock[];
  itinerary: ItineraryDay[]; inclusions: string[]; exclusions: string[];
  ziyarat: TourHighlight[]; booking: ContentBlock[]; gallery: ImageAsset[];
  teamIds: string[]; faqs: FAQ[]; relatedSlugs: string[];
}
export interface Destination {
  name: string; slug: string; status: "draft" | "published";
  hero: { title: string; description: string; image?: ImageAsset };
  introduction: string; currency?: string; language?: string; bestTimeToVisit?: string;
  travelNotes: string[]; visaInformation: ContentBlock[]; highlights: TourHighlight[];
  whyVisit: ContentBlock[]; packages: Package[]; itinerary: ItineraryDay[];
  inclusions: string[]; travelTips: string[]; gallery: ImageAsset[]; faqs: FAQ[];
  seo: SEOData; relatedSlugs: string[]; todos: string[];
  whyChooseUs?: ContentBlock[]; testimonials?: Testimonial[];
}
export interface Service { slug: string; title: string; description: string; href: string }
export type GuideCategory = "Umrah" | "Hajj" | "Visa" | "International Travel" | "Pakistan Travel" | "Travel Tips";
export interface Guide {
  slug: string; title: string; excerpt: string; category: GuideCategory;
  status: "draft" | "published"; image?: ImageAsset;
  author?: { name: string; biography?: string }; publishedAt?: string; updatedAt?: string;
  body: ContentBlock[]; faqs: FAQ[]; relatedSlugs: string[]; relatedPackagePaths: string[];
  cta: CTA; seo: SEOData;
}
export interface NavigationItem { label: string; href: string; children?: NavigationItem[] }
export type SectionKind = "content" | "trust" | "packages" | "destinations" | "services" | "process" | "team" | "testimonials" | "gallery" | "guides" | "faq" | "cta" | "form" | "download" | "comparison" | "location";
export interface SectionConfig {
  id: string; title: string; kind: SectionKind; description?: string;
  items?: string[]; blocks?: ContentBlock[]; packageKind?: PackageKind;
  formKind?: "enquiry" | "corporate" | "class" | "career"; cta?: CTA;
  faqs?: FAQ[]; images?: ImageAsset[]; testimonials?: Testimonial[];
  guideSlugs?: string[]; memberIds?: string[]; trustFacts?: string[];
  downloads?: { title: string; href: string }[];
}
export interface LandingPageData { path: string; title: string; description: string; seo: SEOData; sections: SectionConfig[] }
