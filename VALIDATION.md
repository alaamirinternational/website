# Foundation validation

Validated against the local production build on 2026-09-08.

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, zero errors and warnings |
| `npm run typecheck` | Pass, route type generation and strict `tsc --noEmit` |
| `npm run build` | Pass, Next.js 16.3.4 production build |
| `npm run verify:routes` | Pass, 39 routes and 42 internal links |
| Unknown routes/slugs | Seven cases returned HTTP 404 |
| Page metadata | Unique titles/descriptions, canonicals, OG, Twitter and draft noindex present |
| Document structure | One H1 per page; no empty headings, duplicate IDs or broken in-page anchors |
| Structured data | JSON-LD parsed successfully; no Article or TouristTrip claims on draft records |
| Guide search | Unmatched search returns the empty state |
| Enquiry context | Contact preselects the Hajj enquiry type from its URL |

The route test covered 37 page URLs plus robots and sitemap. Dynamic examples include all five destination pages, eight package preview pages and one draft article. The test server used port 3100 because port 3000 was already occupied. No unrelated server was stopped.

Responsive CSS foundations are present; this validation did not include visual browser screenshots or a full device/accessibility audit. Form submission, WhatsApp delivery, real imagery and PDF downloads cannot be validated until their real configuration/content is supplied. The forms remain explicitly disabled; no submission success is simulated.

The project is a local architecture scaffold. It has not been deployed. Business content, final visual design and launch approval are separate work.
