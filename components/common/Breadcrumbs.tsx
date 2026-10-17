import Link from "next/link";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return <><nav aria-label="Breadcrumb" className="breadcrumbs"><ol>{items.map((item, i) => <li key={item.href}>{i > 0 && <span aria-hidden="true">/ </span>}{i === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}</li>)}</ol></nav><JsonLd data={breadcrumbSchema(items)} /></>;
}
