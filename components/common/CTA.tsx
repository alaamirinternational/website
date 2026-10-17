import Link from "next/link";
import type { CTA as CTAData } from "@/types/content";
import { contactDetails } from "@/data/company";
import { whatsappHref } from "@/lib/links";
export function CTA({ label, href, variant = "primary" }: CTAData) {
  return <Link className={`button ${variant === "secondary" ? "button-secondary" : ""}`} href={href}>{label}</Link>;
}
export function WhatsAppCTA({ message }: { message: string }) {
  const href = whatsappHref(contactDetails.whatsapp, message);
  return href ? <CTA label="WhatsApp Us" href={href} variant="secondary" /> : null;
}
