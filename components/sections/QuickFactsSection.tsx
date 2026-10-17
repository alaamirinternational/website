import { Section, ContentPending } from "./Section";
import type { Fact } from "@/types/content";
export function QuickFactsSection({ id = "quick-facts", title = "Quick facts", facts }: { id?: string; title?: string; facts: Fact[] }) {
  return <Section id={id} title={title}>{facts.length ? <dl className="grid-cards">{facts.map(fact => <div className="card" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl> : <ContentPending subject={title} />}</Section>;
}
