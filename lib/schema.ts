import { site } from "@/config/site";
import { contactDetails } from "@/data/company";
import { absoluteUrl } from "@/lib/seo";
import { packagePath } from "@/lib/links";
import type { FAQ, Guide, Package } from "@/types/content";
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined };
export function organizationSchema(): JsonValue {
  return { "@context": "https://schema.org", "@type": "TravelAgency", "@id": absoluteUrl("/#organization"), name: site.name, url: site.url, email: contactDetails.email, telephone: contactDetails.phone, address: contactDetails.address };
}
export function breadcrumbSchema(items: { label: string; href: string }[]): JsonValue {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.label, item: absoluteUrl(item.href) })) };
}
export function faqSchema(items: FAQ[]): JsonValue {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
}
export function articleSchema(guide: Guide): JsonValue | undefined {
  if (guide.status !== "published" || !guide.author || !guide.publishedAt) return undefined;
  return { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.excerpt, url: absoluteUrl(`/guides/${guide.slug}`), author: { "@type": "Person", name: guide.author.name }, datePublished: guide.publishedAt, dateModified: guide.updatedAt ?? guide.publishedAt, image: guide.image ? absoluteUrl(guide.image.src) : undefined };
}
export function tripSchema(item: Package): JsonValue | undefined {
  if (item.status !== "published") return undefined;
  return { "@context": "https://schema.org", "@type": "TouristTrip", name: item.title, description: item.summary, url: absoluteUrl(packagePath(item)), itinerary: item.itinerary.length ? { "@type": "ItemList", itemListElement: item.itinerary.map((day, i) => ({ "@type": "ListItem", position: i + 1, name: day.title, description: day.description })) } : undefined };
}
