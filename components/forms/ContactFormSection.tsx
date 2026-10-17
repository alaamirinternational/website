import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import type { EnquiryType } from "@/data/enquiries";
import type { FormType } from "@/lib/server/lead-email";

export function ContactFormSection({ id = "contact-form", title = "Travel enquiry", kind = "enquiry", enquiryType = "Other" }: {
  id?: string;
  title?: string;
  kind?: FormType;
  enquiryType?: EnquiryType;
}) {
  return <Section id={id} title={title}>
    <ContactForm id={id} title={title} kind={kind} enquiryType={enquiryType} />
    <p className="small">Read our <Link href="/privacy-policy">privacy policy</Link>.</p>
  </Section>;
}
