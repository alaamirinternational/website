import { Section, ContentPending } from "./Section";
import type { TeamMember } from "@/types/content";
export function TeamSection({ id = "team", title = "Team & guides", members }: { id?: string; title?: string; members: TeamMember[] }) {
  return <Section id={id} title={title}>{members.length ? <div className="grid-cards">{members.map(member => <article key={member.id} className="card"><h3>{member.name}</h3><p>{member.role}</p><p>{member.biography}</p></article>)}</div> : <ContentPending subject="team biographies, roles and credentials" />}</Section>;
}
