import { LandingPage } from "@/components/templates/LandingPage";
import { getLandingPage } from "@/data/pages";
import { createMetadata } from "@/lib/seo";
const page = getLandingPage("/umrah/packages");
export const metadata = createMetadata(page.seo, page.path);
export default function Page() { return <LandingPage page={page} />; }

