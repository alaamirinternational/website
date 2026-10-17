import { Section, ContentPending } from "./Section";
import type { Testimonial } from "@/types/content";
export function TestimonialsSection({ title = "Traveller experiences", testimonials }: { title?: string; testimonials: Testimonial[] }) {
  const approved = testimonials.filter(item => item.consentConfirmed);
  return <Section id="testimonials" title={title}>{approved.length ? <div className="grid-cards">{approved.map(item => <figure className="card" key={item.id}><blockquote>{item.quote}</blockquote><figcaption>{item.name} · {item.context}</figcaption></figure>)}</div> : <ContentPending subject="genuine testimonials with publication permission" />}</Section>;
}
