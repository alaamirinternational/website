import { Section } from "./Section";
import { CTA, WhatsAppCTA } from "@/components/common/CTA";
import type { CTA as CTAData } from "@/types/content";
export function LeadCTASection({ title = "Discuss your travel plans", cta = { label: "Request a quote", href: "/contact" }, message }: { title?: string; cta?: CTAData; message: string }) {
  return <Section id="enquire" title={title}><div className="actions"><CTA {...cta} /><WhatsAppCTA message={message} /></div></Section>;
}
