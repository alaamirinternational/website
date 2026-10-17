import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return site.indexingEnabled ? { rules: { userAgent: "*", allow: "/" }, sitemap: absoluteUrl("/sitemap.xml") } : { rules: { userAgent: "*", disallow: "/" } };
}
