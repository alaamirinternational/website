import { Section, ContentPending } from "./Section";
export function TrustStripSection({ title = "Travel with confidence", facts }: { title?: string; facts: string[] }) {
  return <Section id="trust" title={title}>{facts.length ? <ul className="grid-cards">{facts.map(fact => <li className="card" key={fact}>{fact}</li>)}</ul> : <ContentPending subject="verified credentials and trust information" />}</Section>;
}
