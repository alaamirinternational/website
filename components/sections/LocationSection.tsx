import { Section, ContentPending } from "./Section";
import type { ContactDetails } from "@/types/content";
export function LocationSection({ details }: { details: ContactDetails }) {
  return <Section id="location" title="Office location">{details.address ? <address>{details.address}</address> : <ContentPending subject="verified office location" />}{details.mapUrl && <a href={details.mapUrl}>Open office map</a>}</Section>;
}
