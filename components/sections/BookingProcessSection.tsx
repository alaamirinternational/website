import { Section, ContentPending } from "./Section";
export function BookingProcessSection({ id = "process", title = "How booking works", steps = [] }: { id?: string; title?: string; steps?: string[] }) {
  return <Section id={id} title={title}>{steps.length ? <ol className="steps">{steps.map(step => <li key={step}>{step}</li>)}</ol> : <ContentPending subject={`${title} steps`} />}</Section>;
}
