import type { ReactNode } from "react";
export function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-heading`} className="section"><div className="section-intro"><h2 id={`${id}-heading`}>{title}</h2>{description && <p>{description}</p>}</div>{children}</section>;
}
export function ContentPending({ subject }: { subject: string }) { return <p className="pending">TODO: Add approved {subject.toLowerCase()}.</p>; }
