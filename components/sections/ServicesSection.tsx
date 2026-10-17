import Link from "next/link";
import { Section } from "./Section";
import type { Service } from "@/types/content";
export function ServicesSection({ title = "Travel services", services }: { title?: string; services: Service[] }) {
  return <Section id="services" title={title}><div className="grid-cards">{services.map(item => <article className="card" key={item.slug}><h3><Link href={item.href}>{item.title}</Link></h3><p>{item.description}</p></article>)}</div></Section>;
}
