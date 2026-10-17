import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { JsonLd } from "@/components/common/JsonLd";
import { PageHeroSection } from "@/components/sections/PageHeroSection";
import { ContentSection } from "@/components/sections/ContentSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { GuidesPreviewSection } from "@/components/sections/GuidesPreviewSection";
import { PackageGridSection } from "@/components/sections/PackageGridSection";
import { LeadCTASection } from "@/components/sections/LeadCTASection";
import { guides } from "@/data/guides";
import { packages } from "@/data/packages";
import { articleSchema } from "@/lib/schema";
import { packagePath } from "@/lib/links";
import type { Guide } from "@/types/content";
export function GuideArticlePage({ guide }: { guide: Guide }) {
  return <>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Travel Guides", href: "/guides" }, { label: guide.title, href: `/guides/${guide.slug}` }]} />
    <article><PageHeroSection title={guide.title} description={guide.excerpt} image={guide.image} draft={guide.status === "draft"} />
    <p>{guide.category}{guide.author && ` · By ${guide.author.name}`}</p>
    {guide.publishedAt && <p>Published <time dateTime={guide.publishedAt}>{guide.publishedAt}</time></p>}
    {guide.updatedAt && <p>Updated <time dateTime={guide.updatedAt}>{guide.updatedAt}</time></p>}
    <nav aria-label="Table of contents" className="section"><h2>In this guide</h2><ol className="list">{guide.body.map(block => <li key={block.id}><a href={`#${block.id}`}>{block.title}</a></li>)}</ol></nav>
    {guide.body.map(block => <ContentSection key={block.id} id={block.id} title={block.title} items={block.items} blocks={[{ ...block, title: "", items: undefined }]} />)}
    <FAQSection faqs={guide.faqs} /></article>
    <JsonLd data={articleSchema(guide)} />
    <GuidesPreviewSection id="related-guides" title="Related articles" guides={guides.filter(other => guide.relatedSlugs.includes(other.slug))} />
    <PackageGridSection id="related-packages" title="Related packages" packages={packages.filter(item => guide.relatedPackagePaths.includes(packagePath(item)))} />
    <LeadCTASection cta={guide.cta} message={`I'd like help with ${guide.title}.`} />
  </>;
}
