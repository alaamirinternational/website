import type { LandingPageData, SectionConfig, SectionKind } from "@/types/content";

const s = (id: string, title: string, kind: SectionKind = "content", extra: Partial<SectionConfig> = {}): SectionConfig => ({ id, title, kind, ...extra });
const trust = s("trust", "Travel with confidence", "trust");
const why = s("why-choose-us", "Why choose AlAamir International?");
const process = s("process", "How does booking work?", "process");
const team = s("team", "Team & guides", "team");
const reviews = s("testimonials", "Traveller experiences", "testimonials");
const faq = s("faqs", "Frequently asked questions", "faq");
const lead = s("enquire", "Discuss your travel plans", "cta");
const download = s("download", "Download a travel guide", "download");
const umrahGrid = s("umrah-packages", "Umrah packages", "packages", { packageKind: "umrah" });
const hajjGrid = s("hajj-packages", "Hajj packages", "packages", { packageKind: "hajj" });
const internationalGrid = s("international-packages", "International tour packages", "packages", { packageKind: "international" });
const pakistanGrid = s("pakistan-packages", "Pakistan tour packages", "packages", { packageKind: "pakistan" });
const destinationGrid = s("destinations", "International destinations", "destinations");
const servicesGrid = s("services", "Our travel services", "services");
const gallery = s("gallery", "Travel gallery", "gallery");
const guideGrid = s("guides", "Travel guides", "guides");
function page(path: string, title: string, description: string, sections: SectionConfig[]): LandingPageData {
  return { path, title, description, seo: { title, description, noIndex: true }, sections };
}
const umrahSections = [trust, umrahGrid, why, s("inclusions", "What do Umrah packages include?"), process, download, team, reviews, faq, lead];
const hajjSections = [trust, hajjGrid, s("package-comparison", "Compare Hajj packages", "comparison", { packageKind: "hajj" }), why, s("hajj-journey", "The Hajj journey", "process"), download, team, reviews, faq, lead];
export const landingPages: LandingPageData[] = [
  page("/", "Plan your journey with AlAamir International", "Explore Umrah, Hajj, international tours, Pakistan tours and travel services in one place.", [trust, s("about", "About AlAamir International", "content", { cta: { label: "About AlAamir", href: "/about" } }), umrahGrid, hajjGrid, destinationGrid, pakistanGrid, servicesGrid, why, process, reviews, guideGrid, faq, lead]),
  page("/umrah", "Umrah travel planning", "Find Umrah packages, preparation resources and free class information for your journey.", umrahSections),
  page("/umrah/packages", "Umrah Packages from Pakistan", "Explore Umrah package details and prepare your enquiry around travel dates, accommodation and group requirements.", umrahSections),
  page("/umrah/free-class", "Free Umrah Class", "Prepare for Umrah with a focused class. The next session and registration arrangements are awaiting confirmation.", [s("next-class", "Next class details"), s("learning", "What will you learn?"), s("topics", "Class topics"), s("instructor", "Meet the instructor", "team"), s("attendees", "Who should attend?"), s("registration", "Register for the Umrah class", "form", { formKind: "class" }), s("previous-classes", "Previous class experiences"), faq]),
  page("/umrah/guides", "Umrah Guides & Preparation", "A resource hub for reviewed guidance on Umrah preparation, rituals and common questions.", [s("featured-guide", "Featured Umrah guide", "guides"), s("steps", "What are the steps of Umrah?"), s("ihram", "How do you prepare for Ihram?"), s("miqat", "What should you know about Miqat?"), s("tawaf", "How is Tawaf performed?"), s("sai", "How is Sai performed?"), s("duas", "Duas and supplication guidance"), s("women", "Umrah guidance for women"), faq, download, umrahGrid, lead]),
  page("/hajj", "Hajj travel planning", "Explore the Hajj package structure, preparation support and questions to discuss before booking.", hajjSections),
  page("/hajj/packages", "Hajj Packages from Pakistan", "Review Hajj package information and compare confirmed arrangements when the approved collection is available.", hajjSections),
  page("/international-tours", "International Tours from Pakistan", "Explore destination collections and prepare a travel enquiry based on your country, dates and group requirements.", [destinationGrid, internationalGrid, s("why-travel", "Why travel with AlAamir?"), s("visa", "Visa assistance for your trip"), process, s("experiences", "Travel experiences"), reviews, faq, lead]),
  page("/pakistan-tours", "Pakistan Tours", "Plan a Pakistan travel enquiry around your preferred destinations, dates and group size.", [s("highlights", "Explore Pakistan destinations"), pakistanGrid, s("experiences", "Pakistan travel experiences"), gallery, process, why, reviews, faq, lead]),
  page("/services", "Travel Services", "Find the right place to enquire about pilgrimages, tours, visas, flights, accommodation and corporate travel.", [s("intro", "How can we help with your travel?"), servicesGrid, why, process, faq, lead]),
  page("/services/visa-assistance", "Visa Assistance", "Prepare an enquiry about the documentation and application support relevant to your destination. Approval decisions rest with the relevant authority.", [s("countries", "Visa destinations"), s("types", "Visa types"), s("requirements", "Which requirements apply to your trip?"), s("visa-process", "Visa assistance process", "process"), why, s("documents", "Documents checklist"), faq, s("enquire", "Discuss your visa requirements", "cta", { cta: { label: "Talk about visa assistance", href: "/contact?type=Visa" } })]),
  page("/services/corporate-travel", "Corporate Travel Management", "Discuss your organisation’s flight, hotel, visa and transport requirements through one corporate travel enquiry.", [s("trust", "Corporate travel credentials", "trust"), s("solutions", "Corporate travel solutions"), s("flights", "Business air ticketing"), s("hotels", "Hotels for business travel"), s("visas", "Visa management"), s("transport", "Business transportation"), s("executive", "Executive and group travel"), why, process, s("testimonials", "Corporate client experiences", "testimonials"), s("corporate-enquiry", "Discuss your business travel needs", "form", { formKind: "corporate" }), faq, lead]),
  page("/services/air-ticketing", "Air Ticketing", "Prepare a flight enquiry with your departure city, destination, preferred dates and passenger requirements.", [s("routes", "Flight routes and travel requirements"), s("options", "Ticket options and conditions"), s("documents", "Passenger information checklist"), process, why, faq, lead]),
  page("/services/hotels-accommodation", "Hotels & Accommodation", "Discuss accommodation requirements including destination, dates, room preferences and group size.", [s("stays", "Accommodation options"), s("rooms", "Room and location preferences"), s("conditions", "Stay inclusions and booking conditions"), process, why, faq, lead]),
  page("/services/transport", "Travel Transport", "Prepare a transport enquiry for transfers, journeys and group travel with your route and passenger requirements.", [s("options", "Transport options"), s("routes", "Transfers and routes"), s("requirements", "Passenger and luggage requirements"), process, why, faq, lead]),
  page("/guides", "Travel Guides & Planning Resources", "Find reviewed resources for Umrah, Hajj, visas, international travel, Pakistan travel and travel preparation.", [s("featured", "Featured guide", "guides"), s("latest", "Latest guides", "guides"), s("popular", "Popular guides", "guides"), faq, lead]),
  page("/about", "About AlAamir International", "Learn about AlAamir International, its story and the people behind the travel services.", [s("about", "About AlAamir"), s("story", "Our story"), s("mission", "Mission and vision"), trust, why, s("leadership", "Leadership", "team"), team, reviews, lead]),
  page("/team", "Team & Guides", "Meet the leadership, scholars, guides and travel team once their approved profiles are available.", [s("leadership", "Leadership", "team"), s("scholars", "Scholars & guides", "team"), s("travel-team", "Travel team", "team"), team, s("expertise", "Experience and expertise"), lead]),
  page("/career", "Careers at AlAamir International", "Explore future career and internship opportunities. Roles will appear here when approved for recruitment.", [s("why-work", "Why work with AlAamir?"), s("jobs", "Open positions"), s("categories", "Job categories"), s("hiring", "Hiring process", "process"), s("internships", "Internship opportunities"), s("application", "Career application", "form", { formKind: "career" }), faq]),
  page("/contact", "Contact AlAamir International", "Choose your enquiry type and prepare your travel requirements. Verified contact channels will be added before launch.", [s("quick-contact", "Quick contact"), s("contact-form", "Travel enquiry", "form", { formKind: "enquiry" }), s("office", "Office details"), s("hours", "Office hours"), s("location", "Office location", "location"), faq]),
  page("/privacy-policy", "Privacy Policy", "The AlAamir International privacy policy is awaiting approval before enquiry collection is enabled.", [s("privacy", "How personal information will be handled", "content", { items: ["TODO: Identify the data controller and approved contact details.", "TODO: Define enquiry data, purpose, storage, retention, processors and visitor rights.", "TODO: Review cookies, analytics and consent requirements before launch."] })]),
  page("/terms-and-conditions", "Terms & Conditions", "Booking and website terms will be published after business and legal review.", [s("terms", "Website and booking terms", "content", { items: ["TODO: Add approved scope of services and customer responsibilities.", "TODO: Document quotation validity, supplier conditions and applicable dispute terms."] })]),
  page("/booking-cancellation-policy", "Booking & Cancellation Policy", "Approved payment, amendment, cancellation and refund terms are required before bookings are accepted.", [s("policy", "Booking, changes and cancellations", "content", { items: ["TODO: Add approved payment schedules and booking confirmation rules.", "TODO: Add supplier-specific cancellation, amendment and refund terms."] })]),
];
export function getLandingPage(path: string): LandingPageData {
  const result = landingPages.find(item => item.path === path);
  if (!result) throw new Error(`Missing landing page data: ${path}`);
  return result;
}
