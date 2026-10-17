import { Section, ContentPending } from "./Section";
import { JsonLd } from "@/components/common/JsonLd";
import { faqSchema } from "@/lib/schema";
import type { FAQ } from "@/types/content";
export function FAQSection({ title = "Frequently asked questions", faqs }: { title?: string; faqs: FAQ[] }) {
  return <Section id="faqs" title={title}>{faqs.length ? <>{faqs.map(faq => <details key={faq.question} className="faq"><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}<JsonLd data={faqSchema(faqs)} /></> : <ContentPending subject="reviewed questions and direct answers" />}</Section>;
}
