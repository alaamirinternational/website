import { guideCategories } from "@/data/guides/categories";
import { Section } from "./Section";
export function GuideSearchSection({ query, category }: { query: string; category: string }) {
  return <Section id="guide-search" title="Find a travel guide"><form action="/guides" method="get" role="search" className="form-grid"><label htmlFor="guide-query">Search guides<input id="guide-query" name="q" type="search" defaultValue={query} /></label><label htmlFor="guide-category">Category<select id="guide-category" name="category" defaultValue={category}><option value="">All categories</option>{guideCategories.map(item => <option key={item}>{item}</option>)}</select></label><button className="button" type="submit">Search guides</button></form></Section>;
}
