import Link from "next/link";
import { Section } from "./Section";
import type { Destination } from "@/types/content";
export function DestinationGridSection({ id = "destinations", title, destinations }: { id?: string; title: string; destinations: Destination[] }) {
  return <Section id={id} title={title}><div className="grid-cards">{destinations.map(item => <article className="card" key={item.slug}><h3><Link href={`/international-tours/${item.slug}`}>{item.name}</Link></h3><p>{item.introduction}</p><Link href={`/international-tours/${item.slug}`}>Explore {item.name} <span aria-hidden="true">→</span></Link></article>)}</div></Section>;
}
