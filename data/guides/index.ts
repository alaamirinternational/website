import type { Guide } from "@/types/content";
export const guides: Guide[] = [{
  slug: "umrah-planning-preview", title: "Umrah planning guide — development preview", excerpt: "A reserved article structure for reviewed Umrah planning guidance. This draft is not religious or travel advice.", category: "Umrah", status: "draft",
  body: [{ id: "preparation", title: "How should you prepare for Umrah?", paragraphs: ["TODO: Add guidance reviewed by an approved subject specialist."] }, { id: "documents", title: "Which travel documents should you prepare?", paragraphs: ["TODO: Add current requirements, authoritative sources and a review date."] }],
  faqs: [], relatedSlugs: [], relatedPackagePaths: [], cta: { label: "Explore Umrah packages", href: "/umrah/packages" }, seo: { title: "Umrah Planning Guide — Preview", description: "Development preview for an Umrah planning article with reviewed guidance, questions and related packages.", noIndex: true },
}];
export function getGuideBySlug(slug: string) { return guides.find(guide => guide.slug === slug); }
