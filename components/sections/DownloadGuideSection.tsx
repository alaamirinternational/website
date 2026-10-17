import { Section, ContentPending } from "./Section";
import { CTA } from "@/components/common/CTA";
export function DownloadGuideSection({ title = "Download a guide", downloads }: { title?: string; downloads: { title: string; href: string }[] }) {
  return <Section id="download" title={title}>{downloads.length ? <div className="actions">{downloads.map(item => <CTA key={item.href} label={item.title} href={item.href} variant="secondary" />)}</div> : <ContentPending subject="a reviewed downloadable guide" />}</Section>;
}
