import { Section, ContentPending } from "./Section";
import { PackageCard } from "@/components/cards/PackageCard";
import type { Package } from "@/types/content";
export function PackageGridSection({ id = "packages", title, packages }: { id?: string; title: string; packages: Package[] }) {
  return <Section id={id} title={title}>{packages.length ? <div className="grid-cards">{packages.map(item => <PackageCard key={`${item.kind}-${item.country}-${item.slug}`} item={item} />)}</div> : <ContentPending subject="packages and confirmed inclusions" />}</Section>;
}
