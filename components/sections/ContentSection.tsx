import { Section, ContentPending } from "./Section";
import type { ContentBlock } from "@/types/content";
export function ContentSection({ id, title, description, blocks = [], items = [] }: { id: string; title: string; description?: string; blocks?: ContentBlock[]; items?: string[] }) {
  return <Section id={id} title={title} description={description}>{blocks.map(block => <article key={block.id}>{block.title && <h3>{block.title}</h3>}{block.paragraphs.map((p, i) => <p key={i}>{p}</p>)}{block.items && <ul className="list">{block.items.map(item => <li key={item}>{item}</li>)}</ul>}</article>)}{items.length > 0 && <ul className="list">{items.map(item => <li key={item}>{item}</li>)}</ul>}{!blocks.length && !items.length && <ContentPending subject={title} />}</Section>;
}
