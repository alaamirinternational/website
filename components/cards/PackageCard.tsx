import Image from "next/image";
import type { Package } from "@/types/content";
import { CTA } from "@/components/common/CTA";
import { packagePath } from "@/lib/links";
export function PackageCard({ item }: { item: Package }) {
  return <article className="card">{item.image && <Image {...item.image} alt={item.image.alt} sizes="(max-width: 768px) 100vw, 33vw" />}<p className="eyebrow">{item.status === "draft" ? "Development preview · Not a bookable offer" : item.kind}</p><h3>{item.title}</h3><p>{item.summary}</p>{item.duration && <p>{item.duration}</p>}{item.price && <p>{new Intl.NumberFormat("en-PK", { style: "currency", currency: item.price.currency }).format(item.price.amount)} <small>{item.price.basis}</small></p>}<CTA href={packagePath(item)} label={item.status === "draft" ? "View package structure" : "View Package"} variant="secondary" /></article>;
}

