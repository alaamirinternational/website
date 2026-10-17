import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CTA } from "@/components/common/CTA";
import { PageHeroSection } from "@/components/sections/PageHeroSection";
import { ContentSection } from "@/components/sections/ContentSection";
import { PackageGridSection } from "@/components/sections/PackageGridSection";
import { PackageComparisonSection } from "@/components/sections/PackageComparisonSection";
import { DestinationGridSection } from "@/components/sections/DestinationGridSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BookingProcessSection } from "@/components/sections/BookingProcessSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { GuidesPreviewSection } from "@/components/sections/GuidesPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { LeadCTASection } from "@/components/sections/LeadCTASection";
import { DownloadGuideSection } from "@/components/sections/DownloadGuideSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { TrustStripSection } from "@/components/sections/TrustStripSection";
import { ContactFormSection } from "@/components/forms/ContactFormSection";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";
import { guides } from "@/data/guides";
import { contactDetails, downloads, teamMembers, trustFacts } from "@/data/company";
import { testimonials } from "@/data/testimonials";
import { faqs } from "@/data/faqs";
import type { EnquiryType } from "@/data/enquiries";
import type { LandingPageData, SectionConfig } from "@/types/content";

function PageSection({ section, page, enquiryType }: { section: SectionConfig; page: LandingPageData; enquiryType?: EnquiryType }) {
  const selectedPackages = packages.filter(item => item.kind === section.packageKind);
  switch (section.kind) {
    case "packages": return <PackageGridSection {...section} packages={selectedPackages} />;
    case "comparison": return <PackageComparisonSection title={section.title} packages={selectedPackages} />;
    case "destinations": return <DestinationGridSection {...section} destinations={destinations} />;
    case "services": return <ServicesSection title={section.title} services={services} />;
    case "trust": return <TrustStripSection title={section.title} facts={section.trustFacts ?? trustFacts} />;
    case "process": return <BookingProcessSection {...section} steps={section.items} />;
    case "team": return <TeamSection {...section} members={teamMembers.filter(member => section.memberIds ? section.memberIds.includes(member.id) : section.id === "leadership" ? member.group === "leadership" : section.id === "scholars" ? member.group === "scholars" : section.id === "travel-team" ? member.group === "travel" : true)} />;
    case "testimonials": return <TestimonialsSection title={section.title} testimonials={section.testimonials ?? testimonials} />;
    case "gallery": return <GallerySection title={section.title} images={section.images ?? []} />;
    case "guides": return <GuidesPreviewSection {...section} guides={guides.filter(guide => section.guideSlugs ? section.guideSlugs.includes(guide.slug) : !page.path.startsWith("/umrah") || guide.category === "Umrah")} />;
    case "faq": return <FAQSection title={section.title} faqs={section.faqs ?? faqs} />;
    case "cta": return <LeadCTASection title={section.title} cta={section.cta} message={`I'd like information about ${page.title}.`} />;
    case "download": return <DownloadGuideSection title={section.title} downloads={section.downloads ?? downloads} />;
    case "location": return <LocationSection details={contactDetails} />;
    case "form": return <ContactFormSection id={section.id} title={section.title} kind={section.formKind} enquiryType={enquiryType} />;
    case "content": return <><ContentSection {...section} />{section.cta && <CTA {...section.cta} />}</>;
  }
}
export function LandingPage({ page, enquiryType }: { page: LandingPageData; enquiryType?: EnquiryType }) {
  return <>{page.path !== "/" && <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title, href: page.path }]} />}<PageHeroSection title={page.title} description={page.description} draft />{page.sections.map(section => <PageSection key={section.id} section={section} page={page} enquiryType={enquiryType} />)}</>;
}
