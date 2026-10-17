import { landingPages } from "@/data/pages";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { guides } from "@/data/guides";
import { packagePath } from "@/lib/links";
/** Only approved, indexable content is eligible for the sitemap. */
export function indexablePaths(): string[] {
  return [
    ...landingPages.filter(page => !page.seo.noIndex).map(page => page.path),
    ...destinations.filter(item => item.status === "published" && !item.seo.noIndex).map(item => `/international-tours/${item.slug}`),
    ...packages.filter(item => item.status === "published" && !item.seo.noIndex).map(packagePath),
    ...guides.filter(item => item.status === "published" && !item.seo.noIndex).map(item => `/guides/${item.slug}`),
  ];
}
