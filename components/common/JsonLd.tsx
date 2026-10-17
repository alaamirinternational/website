import type { JsonValue } from "@/lib/schema";
export function JsonLd({ data }: { data: JsonValue | undefined }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
