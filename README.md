# AlAamir International — development foundation

Next.js App Router, TypeScript (strict), React and Tailwind CSS. This is an intentionally restrained local scaffold, not a finished design or a live booking service. All page compositions are server components. Native disclosure controls provide navigation and FAQ interaction; guide search uses a server-rendered GET form. No client component, animation library, UI package, stock imagery or invented business facts was added.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` when configuring the origin. No environment values are required for local development.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
# In another terminal, while the production server is running:
npm run verify:routes
```

`TEST_BASE_URL` can override the route-check origin. Route verification deliberately expects draft/noindex content in this foundation. Update those assertions when approved content is published.

## Architecture

- `app/`: explicit landing routes, six dynamic route patterns, layout, 404, robots and sitemap.
- `components/layout/`: shared Header and Footer.
- `components/common/`: CTA/WhatsApp, Breadcrumbs, safe JSON-LD output.
- `components/sections/`: 22 reusable sections/primitives (plus the shared form section); the same content section handles similar text, inclusion, exclusion, service-detail and resource-topic layouts.
- `components/cards/`: shared PackageCard.
- `components/forms/`: shared enquiry, corporate, class and career form structure.
- `components/templates/`: LandingPage, InternationalDestinationPage, PackageDetailPage and GuideArticlePage.
- `data/pages.ts`: landing-page content and section order. Section data can supply blocks, lists, FAQs, gallery assets, selected guides, team IDs, testimonials, downloads and CTAs.
- `data/destinations/`: one data file per destination plus a registry.
- `data/packages/`: Umrah, Hajj and Pakistan collections and the shared draft helper. International package data belongs to its destination.
- `data/guides/`: typed articles and categories.
- `data/company.ts`, `services.ts`, `navigation.ts`, `testimonials.ts`, `faqs.ts`, `enquiries.ts`: shared approved content and navigation.
- `types/content.ts`: Package, Destination, TourHighlight, ItineraryDay, Service, TeamMember, Testimonial, FAQ, Guide, ContactDetails, CTA, SEOData and section contracts.
- `config/site.ts`, `lib/`: origin/indexing configuration, metadata, schema, link helpers and sitemap eligibility.
- `public/assets/`: named brand, home, Umrah, Hajj, country, Pakistan, services, company and shared asset directories. `.gitkeep` files preserve empty directories.
- `scripts/verify-routes.mjs`: production HTTP, metadata, heading, internal-link, JSON-LD, 404, search and enquiry-context checks.

Small route files select data and delegate rendering. No separate TurkeyPage, AzerbaijanPage or MalaysiaPage exists. No separate company or testimonials page exists; Career is under About. There is no logo carousel.

## Routes

| Area | Routes |
| --- | --- |
| Home | `/` |
| Umrah | `/umrah`, `/umrah/packages`, `/umrah/packages/[slug]`, `/umrah/free-class`, `/umrah/guides` |
| Hajj | `/hajj`, `/hajj/packages`, `/hajj/packages/[slug]` |
| International | `/international-tours`, `/international-tours/[country]`, `/international-tours/[country]/[packageSlug]` |
| Countries | `turkey`, `azerbaijan`, `malaysia`, `country-4`, `country-5` |
| Pakistan | `/pakistan-tours`, `/pakistan-tours/[slug]` |
| Services | `/services`, `/services/visa-assistance`, `/services/corporate-travel`, `/services/air-ticketing`, `/services/hotels-accommodation`, `/services/transport` |
| Guides | `/guides`, `/guides/[slug]` |
| Company | `/about`, `/team`, `/career`, `/contact` |
| Legal | `/privacy-policy`, `/terms-and-conditions`, `/booking-cancellation-policy` |
| SEO | `/robots.txt`, `/sitemap.xml` |

All package collections include a visibly labelled `package-preview` draft to exercise the detail architecture. Example: `/umrah/packages/package-preview` or `/international-tours/turkey/package-preview`. The article preview is `/guides/umrah-planning-preview`. These are not advertised bookable offers. Unknown slugs return 404. No route migrations or redirects were required because the workspace was empty.

## Add a destination

1. Add `data/destinations/<country>.ts` exporting a `Destination` object. `defineDestination` is a draft convenience helper; fill its arrays and facts with approved content before publication.
2. Import the object into `data/destinations/index.ts` and add it to `destinations`.
3. Add owned/licensed assets under `public/assets/international-tours/<country>/`.
4. Supply that country's hero, introduction, travel facts, visa notes, highlights, itinerary, inclusions, tips, FAQs, SEO and packages. Do not reuse another country's prose.

The destination route, package routes, navigation menu, destination grids and eligible sitemap entries derive from the registry. No new page component is needed. Countries 4 and 5 must be renamed only after selection; add redirects if those placeholder URLs have subsequently been shared.

## Add a package or article

Packages require a unique slug within their kind/country. Supply flight/hotel/transport blocks, itinerary, inclusions/exclusions, booking terms, gallery, team IDs, FAQs, contextual CTA and SEO. PackageHero supports price with currency/basis, duration, departure/return dates, availability and location. Omit unknown fields; do not enter fabricated values. `packagePath()` is the canonical link helper.

Articles support body sections with stable IDs for the table of contents, author, publication/update dates, category, featured image, FAQs, related guides, related package paths, CTA and metadata. Related package references use full paths to avoid slug collisions across destinations.

## SEO and AEO

- Central metadata supports unique title/description, canonical, Open Graph images and Twitter cards. Articles add article metadata; dynamic records generate their own metadata.
- Global indexing is off by default. It requires an HTTPS production origin plus `SITE_INDEXING_ENABLED=true`. Each page/record must also be individually approved by clearing `seo.noIndex`; records must have `status: "published"` for sitemap eligibility.
- The default robots file disallows crawling; the default sitemap is intentionally empty. Rebuild after changing publication settings.
- BreadcrumbList matches visible breadcrumbs. FAQPage is emitted only for visible, populated FAQs. Article requires a published record, author and publication date. TouristTrip requires a published package. Draft packages and articles do not emit these schemas.
- TravelAgency is the shared organization entity; it contains only the supplied brand name and configured URL until verified contact data is added. No fake rating, review, price, credential or address schema is emitted.
- One H1 per page, direct introductory summaries, question-oriented sections, quick facts, semantic lists/tables and internal links provide the AEO foundation. Content and review quality still need editorial work.

## Forms, contact and assets

The home page now includes the Urdu Umrah preference survey. Its server route sends submissions to `info@alaamir.co` using Resend's API. Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in the server environment (the sender must be verified with Resend) before submissions can be delivered. The endpoint returns an Urdu service-unavailable message if either value is missing; it does not report success. A small in-memory per-process rate limit is included and should be backed by shared storage if the site runs across multiple instances.

Forms are explicitly disabled previews. They do not collect, store or pretend to send enquiries. Before enabling: add server validation, a selected delivery/persistence provider, spam/rate protection, approved privacy/consent language and real success/failure states. Do not enable only the button. Contact accepts the eight requested enquiry types; CTAs pass context through the URL.

Add verified phone, email, WhatsApp and office information to `data/company.ts`. WhatsApp buttons are omitted until a valid international number exists; each template supplies its own message. No PDF download is offered until an approved file exists. Add image paths, alt text, width and height; shared image components use Next Image with responsive sizes. No remote image domains are enabled.

Responsive foundations use fluid headings, wrapping grids, a mobile navigation layout, 44px-plus navigation/CTA targets, labelled forms, visible focus, a skip link and independently scrollable comparison tables. No sticky overlay or slider is used. Full visual design and device/browser acceptance remain part of the later section work.

## Content and launch TODOs

- Approved logo, palette, fonts and owned photography.
- Real package prices, dates, availability, hotels, flights, itinerary and payment terms.
- Country-specific travel facts, visa information, current source links and FAQs; select countries 4 and 5.
- Company history, credentials, contact channels, office address/hours and map.
- Genuine testimonials with permission and approved team/instructor biographies.
- Class schedule, registration process and genuine past-class material.
- Reviewed religious/travel guides, authors, dates and downloadable PDFs.
- Career openings and application handling.
- Approved legal policies, production domain and lead delivery integration.
- Complete the visual sections and replace all development messages before changing indexing settings.

The generated Next/Vercel demo SVGs and starter favicon were removed because they are unrelated to AlAamir branding. No existing business files were removed. `package-lock.json` is retained for reproducible installation.
