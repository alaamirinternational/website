import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Guide, SEOData } from "@/types/content";
export function absoluteUrl(path: string): string { return new URL(path, site.url).toString(); }
export function createMetadata(seo: SEOData, path: string): Metadata {
  const images = seo.image ? [{ url: absoluteUrl(seo.image.src), width: seo.image.width, height: seo.image.height, alt: seo.image.alt }] : undefined;
  const index = site.indexingEnabled && !seo.noIndex;
  return {
    title: seo.title, description: seo.description, alternates: { canonical: absoluteUrl(path) },
    robots: { index, follow: index },
    openGraph: { type: "website", siteName: site.name, title: seo.title, description: seo.description, url: absoluteUrl(path), images },
    twitter: { card: images ? "summary_large_image" : "summary", title: seo.title, description: seo.description, images: images?.map(image => image.url) },
  };
}
export function createArticleMetadata(guide: Guide): Metadata {
  const metadata = createMetadata({ ...guide.seo, noIndex: guide.status === "draft" || guide.seo.noIndex }, `/guides/${guide.slug}`);
  return {
    ...metadata,
    authors: guide.author ? [{ name: guide.author.name }] : undefined,
    openGraph: { ...metadata.openGraph, type: "article", publishedTime: guide.publishedAt, modifiedTime: guide.updatedAt, authors: guide.author ? [guide.author.name] : undefined, section: guide.category },
  };
}
