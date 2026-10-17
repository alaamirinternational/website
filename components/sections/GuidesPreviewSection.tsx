import Link from "next/link";
import { Section, ContentPending } from "./Section";
import type { Guide } from "@/types/content";
export function GuidesPreviewSection({ id = "guides", title = "Travel guides", guides }: { id?: string; title?: string; guides: Guide[] }) {
  return <Section id={id} title={title}>{guides.length ? <div className="grid-cards">{guides.map(guide => <article className="card" key={guide.slug}><p className="eyebrow">{guide.category}{guide.status === "draft" && " · Draft"}</p><h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3><p>{guide.excerpt}</p></article>)}</div> : <ContentPending subject="reviewed articles" />}</Section>;
}
