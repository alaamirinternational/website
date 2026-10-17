import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { indexablePaths } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return site.indexingEnabled ? indexablePaths().map(path => ({ url: absoluteUrl(path) })) : [];
}
