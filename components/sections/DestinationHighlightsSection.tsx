import { Section, ContentPending } from "./Section";
import type { TourHighlight } from "@/types/content";
export function DestinationHighlightsSection({ id = "highlights", title, highlights }: { id?: string; title: string; highlights: TourHighlight[] }) {
  return <Section id={id} title={title}>{highlights.length ? <div className="grid-cards">{highlights.map(item => <article key={item.title} className="card"><h3>{item.title}</h3><p>{item.description}</p></article>)}</div> : <ContentPending subject={title} />}</Section>;
}
