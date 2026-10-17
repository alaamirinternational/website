import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageHeroSection } from "@/components/sections/PageHeroSection";
import { GuideSearchSection } from "@/components/sections/GuideSearchSection";
import { GuidesPreviewSection } from "@/components/sections/GuidesPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { LeadCTASection } from "@/components/sections/LeadCTASection";
import { guides } from "@/data/guides";
import { guideCategories } from "@/data/guides/categories";
import { getLandingPage } from "@/data/pages";
import { createMetadata } from "@/lib/seo";
const page = getLandingPage("/guides");
export const metadata = createMetadata(page.seo, page.path);
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[]; category?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 200).trim() : "";
  const category = typeof params.category === "string" && guideCategories.some(item => item === params.category) ? params.category : "";
  const filtered = guides.filter(guide => (!category || guide.category === category) && `${guide.title} ${guide.excerpt}`.toLowerCase().includes(query.toLowerCase()));
  return <><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Travel Guides", href: "/guides" }]} /><PageHeroSection title={page.title} description={page.description} draft /><GuideSearchSection query={query} category={category} /><GuidesPreviewSection id="results" title={query || category ? "Search results" : "Latest guides"} guides={filtered} />{(query || category) && filtered.length === 0 && <p role="status">No guides match your search. Try a different term or category.</p>}<GuidesPreviewSection id="featured" title="Featured guide" guides={guides.slice(0, 1)} /><GuidesPreviewSection id="popular" title="Popular guides" guides={[]} /><FAQSection faqs={[]} /><LeadCTASection message="I'd like help planning my travel." /></>;
}

