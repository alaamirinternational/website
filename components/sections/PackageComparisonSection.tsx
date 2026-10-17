import { Section, ContentPending } from "./Section";
import type { Package } from "@/types/content";
export function PackageComparisonSection({ title = "Compare packages", packages }: { title?: string; packages: Package[] }) {
  const published = packages.filter(item => item.status === "published");
  return <Section id="package-comparison" title={title}>{published.length ? <div className="table-scroll" role="region" aria-label="Package comparison" tabIndex={0}><table><caption>Confirmed package details</caption><thead><tr><th scope="col">Package</th><th scope="col">Duration</th><th scope="col">Price</th><th scope="col">Availability</th></tr></thead><tbody>{published.map(item => <tr key={item.slug}><th scope="row">{item.title}</th><td>{item.duration ?? "Enquire"}</td><td>{item.price ? `${item.price.currency} ${item.price.amount} ${item.price.basis}` : "Request quote"}</td><td>{item.availability ?? "Enquire"}</td></tr>)}</tbody></table></div> : <ContentPending subject="confirmed packages for comparison" />}</Section>;
}
