import { PageHeroSection } from "./PageHeroSection";
import { WhatsAppCTA } from "@/components/common/CTA";
import type { Package } from "@/types/content";
export function PackageHeroSection({ item }: { item: Package }) {
  const facts = [{ label: "Price", value: item.price ? `${item.price.currency} ${item.price.amount.toLocaleString("en-PK")} ${item.price.basis}` : undefined }, { label: "Duration", value: item.duration }, { label: "Departure date", value: item.departureDate }, { label: "Return date", value: item.returnDate }, { label: "Availability", value: item.availability }, { label: "Location", value: item.location }];
  return <><PageHeroSection title={item.title} description={item.summary} image={item.image} cta={item.primaryCTA} draft={item.status === "draft"} /><dl className="grid-cards">{facts.map(fact => <div className="card" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value ?? "Awaiting confirmation"}</dd></div>)}</dl><WhatsAppCTA message={item.whatsappMessage} /></>;
}
