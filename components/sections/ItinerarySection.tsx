import { Section, ContentPending } from "./Section";
import type { ItineraryDay } from "@/types/content";
export function ItinerarySection({ title = "Itinerary", days }: { title?: string; days: ItineraryDay[] }) {
  return <Section id="itinerary" title={title}>{days.length ? <ol className="steps">{days.map(day => <li key={day.day}><h3>Day {day.day}: {day.title}</h3><p>{day.description}</p></li>)}</ol> : <ContentPending subject={title} />}</Section>;
}
