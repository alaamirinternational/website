import { LandingPage } from "@/components/templates/LandingPage";
import { getLandingPage } from "@/data/pages";
import { getEnquiryType } from "@/data/enquiries";
import { createMetadata } from "@/lib/seo";
const page = getLandingPage("/contact");
export const metadata = createMetadata(page.seo, page.path);
export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const value = (await searchParams).type;
  return <LandingPage page={page} enquiryType={getEnquiryType(typeof value === "string" ? value : undefined)} />;
}

